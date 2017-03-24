import { RotavatorPage } from './app.po';

describe('rotavator App', () => {
  let page: RotavatorPage;

  beforeEach(() => {
    page = new RotavatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
