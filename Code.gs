function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Barbearia Elite')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
