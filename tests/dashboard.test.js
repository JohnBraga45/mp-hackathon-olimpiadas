import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';

describe('Olympics Dashboard Tests', function () {
    this.timeout(60000);

    let driver;

    before(async function () {
        try {
            driver = await new Builder().forBrowser('chrome').build();
        } catch (error) {
            console.error('Erro ao iniciar o WebDriver:', error);
            throw error;
        }
    });

    after(async function () {
        if (driver) {
            try {
                await driver.quit();
            } catch (error) {
                console.error('Erro ao fechar o WebDriver:', error);
            }
        }
    });

    it('should load the page and display the title', async function () {
        try {
            await driver.get('http://localhost:5500');
            const title = await driver.getTitle();
            expect(title).to.equal('Jogos Olímpicos - Dashboard');
        } catch (error) {
            console.error('Erro no teste "should load the page and display the title":', error);
            throw error;
        }
    });

    it('should have year select options', async function () {
        try {
            await driver.get('http://localhost:5500');
            const yearSelect = await driver.findElement(By.id('year'));
            const options = await yearSelect.findElements(By.tagName('option'));
            expect(options.length).to.be.greaterThan(0);
        } catch (error) {
            console.error('Erro no teste "should have year select options":', error);
            throw error;
        }
    });

    it('should update the chart when filters are applied', async function () {
        try {
            await driver.get('http://localhost:5500');

            const yearSelect = await driver.findElement(By.id('year'));
            await yearSelect.sendKeys('2024');

            const medalChartContainer = await driver.findElement(By.id('medalChartContainer'));
            await driver.wait(until.elementIsVisible(medalChartContainer), 5000);

            const canvas = await driver.findElement(By.id('medalChart'));
            const isDisplayed = await canvas.isDisplayed();
            expect(isDisplayed).to.be.true;
        } catch (error) {
            console.error('Erro no teste "should update the chart when filters are applied":', error);
            throw error;
        }
    });

    it('should display no data message when no results are available', async function () {
        try {
            await driver.get('http://localhost:5500');

            const yearSelect = await driver.findElement(By.id('year'));
            await yearSelect.sendKeys('2024');

            const countrySelect = await driver.findElement(By.id('country'));
            await countrySelect.sendKeys('Nonexistent Country');

            const noDataMessage = await driver.findElement(By.id('noDataMessage'));
            const isDisplayed = await noDataMessage.isDisplayed();
            expect(isDisplayed).to.be.false;
        } catch (error) {
            console.error('Erro no teste "should display no data message when no results are available":', error);
            throw error;
        }
    });

    it('should initialize the map with default view', async function () {
        const mapElement = await driver.findElement(By.id('map'));
        await driver.wait(until.elementIsVisible(mapElement), 70000);

        await driver.sleep(10000);

        const mapCanvas = await driver.wait(until.elementLocated(By.css('#map')), 80000);

        const isDisplayed = await mapCanvas.isDisplayed();
        expect(isDisplayed).to.be.true;
    });
});
