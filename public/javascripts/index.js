class Model {
  constructor() {
    this.url = 'http://localhost:3000/bins';
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
    this.currentRequests = await this.request(`${this.url}/${binId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async postBin() {
    this.currentBin = await this.request(this.url, { method: 'POST' });
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

  insertRequests(bin) {
    this.removeBinList();
    this.insertBinInfo(bin);
    const reqs = this.templates['reqListTemplate'](bin.requests);
    console.log(reqs);
  }
  
  insertBinInfo(bin) {
    const binInfo = this.templates['binInfoTemplate'](bin);
    console.log(binInfo);
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
  }

  handleSelectBin = async target => {
    const binId = target.getAttribute('data-id');
    this.model.currentBin = { binId: binId };
    await this.model.getReqs(binId);
    debugger;
    this.buildBin();
  }

  handleNewBin = async target => {
    await this.model.postBin();
    // this.buildBin();
  }

  buildBinList() {
    this.view.insertBins(this.model.bins);
  }

  buildBin() {
    this.view.insertRequests(this.model.currentRequests);
  }
}
let app;

addEventListener('DOMContentLoaded', () => {
  app = new Controller(new Model(), new View());
});