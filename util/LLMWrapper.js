class MockRes {
    constructor() {
      this.statusCode = 200;
      this.body = null;
    }
  
    status(code) {
      this.statusCode = code;
      return this;
    }
  
    send(body) {
      this.body = body;
      return this;
    }
  
    json(body) {
      this.body = body;
      return this;
    }
  }

  
  const wrapFunction = (originalFunction) => async (params) => {
    const mockReq = {
      body: params,
      params: params,
      query: params
    };
  
    const mockRes = new MockRes();
  
    await originalFunction(mockReq, mockRes);
  
    if (mockRes.statusCode >= 400) {
      throw new Error(mockRes.body);
    }
  
    return mockRes.body;
  };
  
  module.exports = wrapFunction;