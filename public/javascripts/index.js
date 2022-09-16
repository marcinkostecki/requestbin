class Model {
  constructor() {
    this.url = 'http://localhost:3000/bins';
    this.endpoint = 'http://localhost:3000/req';
    this.WEBSOCKET_SERVER_URL = 'ws://localhost:7071';
    // this.url = 'https://app.marcinkostecki.info/bins';
    // this.endpoint = 'https://app.marcinkostecki.info/req';
  }

  // eslint-disable-next-line consistent-return
  async request(url, options) {
    try {
      let response = await fetch(url, options);
      if (response.ok) return this.responseData(response);

      console.log(`Response Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  }

  responseData(response) {
    let contentType = response.headers.get('Content-Type');
    if (!contentType) {
      return null;
    } else if (contentType.includes('json')) {
      return response.json();
    } else {
      return response.text();
    }
  }

  async getBins(ip) {
    this.bins = await this.request(this.url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async getReqs(binId) {
    const response = await this.request(`${this.url}/${binId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    this.binInfo = response.binInfo;
    this.currentRequests = response.requests;
    this.formatBinInfo();
    this.formatRequests();
  }

  async postBin() {
    this.currentBin = await this.request(this.url, { method: 'POST' });
  }

  formatBinInfo() {
    this.binInfo.binUrl = `${this.endpoint}/${this.binInfo.binId}`;
    this.binInfo.count = this.currentRequests.length;
    this.binInfo.status = this.binInfo.active ? 'Active' : 'Inactive';
  }

  formatRequests() {
    this.formatheaders();
    this.formatBody();
  }

  formatheaders() {
    this.currentRequests.forEach(req => {
      const keys = Object.keys(req.headers);
      req.headers = keys.map(key => {
        return { name: key, value: req.headers[key] };
      });
    });
  }

  formatBody() {
    this.currentRequests.forEach(req => {
      req.body = JSON.stringify(JSON.parse(req.body), null, 2);
    });
  }
}

class View {
  constructor() {
    this.compileTemplates();
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  getAllElements(selector) {
    return [...document.querySelectorAll(selector)];
  }

  compileTemplates() {
    this.templates = {};
    let templates = this.getAllElements('[type="text/x-handlebars"]');
    templates.forEach(template => {
      this.templates[template.id] = Handlebars.compile(template.innerHTML);
    });
  }

  insertBins(bins) {
    this.removeBinList();
    const binList = this.templates['binListTemplate'](bins);
    this.getElement('main').insertAdjacentHTML('afterbegin', binList);
    this.binList = this.getElement('#binList');
    this.newBinButton = this.getElement("#newBinBttn");
  }

  removeBinList() {
    let list = this.getElement('#binList');
    if (list) list.remove();
  }

  bindSelectBin(handler) {
    this.binList.onclick = event => {
      event.preventDefault();
      let target = event.target;
      if (target.classList.contains('binLink')) handler(target);
    };
  }

  bindNewBinButton(handler) {
    this.newBinButton.onclick = event => {
      event.preventDefault();
      let target = event.target;
      handler(target);
    }
  }

  bindBinsButton(handler) {
    this.getElement('header a').onclick = event => {
      event.preventDefault();
      handler();
    }
  }

  bindCopy(handler) {
    this.getElement('.copy').onclick = event => {
      event.preventDefault();
      handler(this.getUrl(event.target));
    }
  }

  bindRefresh(handler) {
    this.getElement('.refresh').onclick = event => {
      event.preventDefault();
      handler();
    }
  }

  insertRequests(binInfo, reqs) {
    this.wipeClean();
    this.insertBinInfo(binInfo);
    const reqsHtml = this.templates['reqListTemplate'](reqs);
    this.getElement('main').insertAdjacentHTML('beforeend', reqsHtml);
  }

  insertBinInfo(binInfo) {
    const binInfoHtml = this.templates['binInfoTemplate'](binInfo);
    this.getElement('main').insertAdjacentHTML('afterbegin', binInfoHtml);
  }

  wipeClean() {
    this.getElement('main').innerHTML = "";
  }

  getUrl(target) {
    return target.closest('#endpoint').querySelector('span').textContent;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.firstRender();
  }

  async firstRender() {
    await this.model.getBins();
    this.buildBinList();
    this.view.bindSelectBin(this.handleSelectBin);
    this.view.bindNewBinButton(this.handleNewBin);
    this.view.bindBinsButton(this.handleBinsButton);
  }

  handleSelectBin = async target => {
    const binId = target.getAttribute('data-id');
    this.model.currentBin = { binId: binId };
    await this.model.getReqs(binId);
    this.buildBin();
  }

  handleNewBin = async target => {
    await this.model.postBin();
    await this.model.getReqs(this.model.currentBin.binId);
    this.buildBin();
  }

  handleBinsButton = async () => {
    await this.model.websocket.close();
    this.model.websocket = undefined;
    this.view.wipeClean();
    this.firstRender();
  }

  handleCopy = async url => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      console.log('copy failed');
    }
  }

  handleRefresh = async () => {
    await this.model.getReqs(this.model.currentBin.binId);
    this.view.wipeClean();
    this.buildBin();
  }

  buildBinList() {
    this.view.insertBins(this.model.bins);
  }

  async buildBin() {
    this.view.insertRequests(this.model.binInfo, this.model.currentRequests);
    this.view.bindCopy(this.handleCopy);
    this.view.bindRefresh(this.handleRefresh);
    this.model.websocket = await this.setUpWebsocket();
  }

  setUpWebsocket() {
    const websocket = new WebSocket(this.model.WEBSOCKET_SERVER_URL);
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (websocket.readyState === 1) {
          clearInterval(interval);
          websocket.send(JSON.stringify({ type: 'new_subscriber', publicId: this.model.currentBin.binId }));
          websocket.onmessage = async () => {
            await this.model.getReqs(this.model.currentBin.binId);
            this.view.insertRequests(this.model.binInfo, this.model.currentRequests);
            this.view.bindCopy(this.handleCopy);
          };
          resolve(websocket);
        }
      }, 10);
    });
  }
}

let app;
addEventListener('DOMContentLoaded', () => {
  app = new Controller(new Model(), new View());
});
