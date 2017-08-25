import { SwiftHireWebPage } from './app.po';

describe('swift-hire-web App', () => {
  let page: SwiftHireWebPage;

  beforeEach(() => {
    page = new SwiftHireWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
