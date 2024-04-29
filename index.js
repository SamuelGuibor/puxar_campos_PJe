const fs = require('node:fs');
const content = 'Some content!';
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  
  // Acessar PJe RJ 
  await page.goto('https://pje.tjmt.jus.br/pje/login.seam');
  await page.waitForTimeout(20000);

  // Realize as navegações necessárias
  await page.evaluate(() => {
    document.querySelector('#barraSuperiorPrincipal > div > div.navbar-header > ul > li > a').click();
  });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    document.querySelector('#menu > div.nivel.nivel-aberto > ul > li:nth-child(2) > a').click();
  });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    document.querySelector('#menu > div.nivel.nivel-aberto.nivel-overlay > ul > li:nth-child(2) > div > ul > li:nth-child(1) > a').click();
  });
  await page.waitForTimeout(3000);

   await page.select('[id="processoTrfForm\:classeJudicial\:j_id192\:areaDireitoCombo"]', '1125');


  await page.waitForTimeout(3000);

  const extractOptions = async (selector) => {
    return await page.evaluate((selector) => {
      const options = document.querySelectorAll(selector + ' option');
      const arr = [];
      options.forEach(option => {
        if (option.innerText != "Selecione"){
          arr.push({text:option.innerText,
                    value:option.value});
        }
      });
      return arr;
    }, selector);
  };

  // Extrair os nomes das opções para o primeiro campo
  const arrjurisdicao = await extractOptions('[id="processoTrfForm\:classeJudicial\:jurisdicaoComboDecoration\:jurisdicaoCombo"]');
  console.log('Opções para o primeiro campo:');
  console.log(arrjurisdicao);

  // Extrair os nomes  
    const final_obj = []
  for (let optionobj of arrjurisdicao) {

    await page.select('[id="processoTrfForm\:classeJudicial\:jurisdicaoComboDecoration\:jurisdicaoCombo"]', optionobj.value);
    await page.waitForTimeout(2000); 

    let arrClasseJudicial = await extractOptions('[id="processoTrfForm\:classeJudicial\:classeJudicialComboDecoration\:classeJudicialCombo"]');
    let arrClasses = []
    arrClasseJudicial.forEach(i => {

        arrClasses.push({...i})
        
    })
    final_obj.push({text:optionobj.text, value:optionobj.value, classes:arrClasses})
    arrClasses = []
  }

    let jsonfile = JSON.stringify(final_obj)
    try {
        fs.writeFileSync('classes_judiciais_obrigacoes.json', jsonfile);
    } catch (err) {
    console.error(err);
    }

  await page.waitForTimeout(30000);

})();