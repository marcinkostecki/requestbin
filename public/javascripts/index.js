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
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.firstRender();
  }

  async firstRender() {
    await this.model.getBins();
    console.log(this.model.bins);
    console.log(this.view.templates)
  }
}

const app = new Controller(new Model(), new View());