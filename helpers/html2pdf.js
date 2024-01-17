import { HtmlConverter, PDFEngine } from "chromiumly";
import Handlebars from "handlebars";
import { readFile } from 'node:fs/promises'
import Timecard from '../models/timecard.js'
export async function generateTimecardPDF(timecardID) {
    const timecard = await Timecard.findById(timecardID).exec()
    const template = await readFile((process.cwd() + '/views/admin/timecard.hbs'), 'utf-8')
    const filename = `${timecard.empName}-${timecard.week}_timecard.pdf`
    const compiledTemplate = Handlebars.compile(template, {
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    });
    const html = compiledTemplate({ timecard });
    console.log(html);
    const converter = new HtmlConverter();
    await converter.convert(html).then(buffer => { PDFEngine.generate(buffer, filename); });
    console.log(`PDF Timecard generated - ${filename}`);
    return filename
}