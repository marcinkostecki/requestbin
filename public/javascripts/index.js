class Model {
  constructor() {
    this.url = 'http://localhost:3000/bins';
    this.endpoint = 'http://localhost:3000/req';
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
    this.formatHeaders();
  }

  async postBin() {
    this.currentBin = await this.request(this.url, { method: 'POST' });
  }

  formatBinInfo() {
    this.binInfo.binUrl = `${this.endpoint}/${this.binInfo.binId}`;
    this.binInfo.count = this.currentRequests.length;
    this.binInfo.status = this.binInfo.active ? 'Active' : 'Inactive';
  }

  formatHeaders() {
    this.currentRequests.forEach(req => {
      const keys = Object.keys(req.headers);
      req.headers = keys.map(key => {
        return { name: key, value: req.headers[key] };
      });
    });
  }
}

class View {
  constructor() {
    this.compileTemplates();
    this.retrieveElements();
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  getAllElements(selector) {
    return [...document.querySelectorAll(selector)];
  }

  retrieveElements() {

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

  insertRequests(binInfo, reqs) {
    this.removeBinList();
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
    debugger;
    await this.model.getReqs(this.model.currentBin.binId);
    this.buildBin();
  }

  handleBinsButton = async => {
    this.view.wipeClean();
    this.firstRender();
  }

  buildBinList() {
    this.view.insertBins(this.model.bins);
  }

  buildBin() {
    this.view.insertRequests(this.model.binInfo, this.model.currentRequests);
  }
}
let app;

addEventListener('DOMContentLoaded', () => {
  app = new Controller(new Model(), new View());
});