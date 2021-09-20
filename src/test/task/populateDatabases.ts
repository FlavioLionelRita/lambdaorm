import fs from 'fs'
import { orm } from '../../orm'

async function schemaSync(target: string) {
  await orm.database.sync(target).execute()
}
async function schemaDrop(target: string, TryAndContinue: boolean = false) {
  if (orm.database.exists(target))
    await orm.database.clean(target).execute(TryAndContinue)
}
async function schemaExport(source: string) {
  let exportFile = 'src/test/data/' + source + '-export.json'
  let data = await orm.database.export(source)
  fs.writeFileSync(exportFile, JSON.stringify(data, null, 2))
}
async function schemaImport(source: string, target: string) {
  let sourceFile = 'src/test/data/' + source + '-export.json'
  let data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'))
  await orm.database.import(target, data)
}

export async function apply(configPath: string, callback: any) {

  await orm.init(configPath)

  await schemaSync('source')
  await schemaExport('source')
  //test mysql
  await schemaDrop('mysql', true)
  await schemaSync('mysql')
  await schemaImport('source', 'mysql')
  await schemaExport('mysql')
  // //test mariadb
  // await schemaDrop('mariadb',true)
  // await schemaSync('mariadb')
  // await schemaImport('source','mariadb')
  // await schemaExport('mariadb')
  //test postgres
  await schemaDrop('postgres', true)
  await schemaSync('postgres')
  await schemaImport('source', 'postgres')
  await schemaExport('postgres')

  callback()
}