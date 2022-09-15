class Model {
  constructor() {
    this.url = 'http://localhost:3000/bin';
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
}

class View {

}

class Controller {

}

const app = new Controller(new Model(), new View());