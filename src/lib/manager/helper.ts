import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { Delta } from '../index'

const { DateTime } = require('luxon')
const SqlString = require('sqlstring')
const CryptoJS = require('crypto-js')

export class Helper {
	public static replace (string:string, search:string, replace:string) {
		return string.split(search).join(replace)
		// con la siguiente opcion falla cuando se hace value=Helper.replace(value,"\\'","\\''")
		// return string.replace(new RegExp(search, 'g'), replace)
	}

	public static clone (obj:any):any {
		return obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj
	}

	public static cloneOperand (obj:any):any {
		const children = []
		if (obj.children) {
			for (const k in obj.children) {
				const p = obj.children[k]
				const child = Helper.clone(p)
				children.push(child)
			}
		}
		return new obj.constructor(obj.name, children)
	}

	public static encrypt (value:string, key:string):string {
		return CryptoJS.AES.encrypt(value, key).toString()
	}

	public static decrypt (value:string, key:string):string {
		const bytes = CryptoJS.AES.decrypt(value, key)
		return bytes.toString(CryptoJS.enc.Utf8)
	}

	public static textTobase64 (value:string):string {
		return CryptoJS.enc.Base64.parse(value)
	}

	public static base64ToText (value:string):string {
		return CryptoJS.enc.Base64.stringify(value)
	}

	public static isObject (obj:any):boolean {
		return obj && typeof obj === 'object' && obj.constructor === Object
	}

	public static isEmpty (value:any):boolean {
		return value === null || value === undefined || value.toString().trim().length === 0
	}

	public static nvl (value:any, _default:any):any {
		return !this.isEmpty(value) ? value : _default
	}

	public static async exec (command: string, cwd:string = process.cwd()):Promise<any> {
		return new Promise<string>((resolve, reject) => {
			exec(command, { cwd: cwd }, (error: any, stdout: any, stderr: any) => {
				if (stdout) return resolve(stdout)
				if (stderr) return resolve(stderr)
				if (error) return reject(error)
				return resolve('')
			})
		})
	}

	public static async existsPath (fullPath:string):Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			fs.access(fullPath, (err) => {
				if (err) {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		})
	}

	public static async createIfNotExists (fullPath:string):Promise<void> {
		if (await Helper.existsPath(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public static async readFile (filePath: string): Promise<string|null> {
		if (!await Helper.existsPath(filePath)) { return null }
		return new Promise<string>((resolve, reject) => {
			fs.readFile(filePath, (err, data) => err ? reject(err) : resolve(data.toString('utf8')))
		})
	}

	public static async removeFile (fullPath:string):Promise<void> {
		if (!await Helper.existsPath(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.unlink(fullPath, err => err ? reject(err) : resolve())
		})
	}

	public static async copyFile (src: string, dest:string): Promise<void> {
		if (!await Helper.existsPath(src)) {
			throw new Error(`not exists ${src}`)
		}
		return new Promise<void>((resolve, reject) => {
			fs.copyFile(src, dest, err => err ? reject(err) : resolve())
		})
	}

	public static async writeFile (filePath: string, content: string): Promise<void> {
		const dir = path.dirname(filePath)
		if (!await Helper.existsPath(dir)) {
			await Helper.mkdir(dir)
		}
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, { encoding: 'utf8' }, err => err ? reject(err) : resolve())
		})
	}

	public static async mkdir (fullPath:string):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public static async lstat (fullPath:string):Promise<fs.Stats> {
		return new Promise<fs.Stats>((resolve, reject) => {
			fs.lstat(fullPath, (err, stats) => err
				? reject(err)
				: resolve(stats))
		})
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public static clearLambda (func:Function) {
		const str = func.toString().trim()
		const index = str.indexOf('=>') + 2
		return str.substring(index, str.length).trim()
	}

	public static getEnvironmentVariable (text:string):string|undefined {
		const environmentName = []
		const index = text.indexOf('$$')
		if (index < 0) {
			return undefined
		}
		const alphanumeric = /[a-zA-Z0-9_]+$/
		const buffer = text.substring(index + 2).split('')
		for (let i = 0; i < buffer.length; i++) {
			const char = buffer[i]
			if (alphanumeric.test(char)) {
				environmentName.push(char)
			} else {
				break
			}
		}
		return environmentName.join('')
	}

	public static solveEnvironmentVariables (source:any): void {
		if (typeof source === 'object') {
			for (const name in source) {
				let child = source[name]
				if (typeof child === 'string' && child.indexOf('$$') >= 0) {
					// there can be more than one environment variable in text
					while (child.indexOf('$$') >= 0) {
						const envrironmentVariable = Helper.getEnvironmentVariable(child)
						if (envrironmentVariable) {
							const environmentVariableValue = process.env[envrironmentVariable]
							if (environmentVariableValue === undefined || environmentVariableValue === null) {
								child = Helper.replace(child, '$$' + envrironmentVariable, '')
							} else {
								const objValue = Helper.tryParse(environmentVariableValue)
								if (objValue) {
									child = Helper.replace(child, '$$' + envrironmentVariable, JSON.stringify(objValue))
								} else {
									child = Helper.replace(child, '$$' + envrironmentVariable, environmentVariableValue)
								}
							}
						}
						source[name] = child
					}
				} else if (typeof child === 'object') {
					Helper.solveEnvironmentVariables(child)
				}
			}
		}
	}

	public static deltaWithSimpleArrays (current:any, old?:any):Delta {
		const delta = new Delta()
		if (current === undefined || current === null) {
			throw new Error('current value can\'t empty')
		}
		for (const name in current) {
			const currentValue = current[name]
			if (old === undefined || old === null) {
				delta.new.push({ name: name, new: currentValue })
			} else {
				const oldValue = old[name]
				if (oldValue === undefined) {
					delta.new.push({ name: name, new: currentValue })
				} else if (oldValue === null && currentValue === null) {
					delta.unchanged.push({ name: name, value: oldValue })
				} else if ((oldValue !== null && currentValue === null) || (oldValue === null && currentValue !== null)) {
					delta.changed.push({ name: name, new: currentValue, old: oldValue, delta: null })
				} else if (Array.isArray(currentValue)) {
					if (!Array.isArray(oldValue)) { throw new Error(`current value in ${name} is array by old no`) }
					if (currentValue.length === 0 && oldValue.length === 0) {
						delta.unchanged.push({ name: name, value: oldValue })
					}
					const arrayDelta = new Delta()
					const news = currentValue.filter(p => oldValue.indexOf(p) === -1)
					const unchangeds = currentValue.filter(p => oldValue.indexOf(p) !== -1)
					const removes = oldValue.filter(p => currentValue.indexOf(p) === -1)
					const change = news.length + removes.length > 0
					for (const p in news) {
						arrayDelta.new.push({ name: p, new: p })
					}
					for (const p in removes) {
						arrayDelta.remove.push({ name: p, old: p })
					}
					for (const p in unchangeds) {
						arrayDelta.unchanged.push({ name: p, value: p })
					}
					delta.children.push({ name: name, type: 'array', change: change, delta: arrayDelta })
				} else if (Helper.isObject(currentValue)) {
					const objectDelta = Helper.deltaWithSimpleArrays(currentValue, oldValue)
					const change = objectDelta.changed.length + objectDelta.remove.length + objectDelta.new.length > 0
					if (change) {
						delta.changed.push({ name: name, new: currentValue, old: oldValue, delta: objectDelta })
					} else {
						delta.unchanged.push({ name: name, value: oldValue })
					}
					// const objectDelta = Helper.deltaWithSimpleArrays(currentValue,oldValue)
					// const change = objectDelta.changed.length + objectDelta.remove.length + objectDelta.new.length > 0
					// delta.children.push({name:name,type:'object',change:change,delta:objectDelta})
				} else if (oldValue !== currentValue) {
					delta.changed.push({ name: name, new: currentValue, old: oldValue, delta: null })
				} else {
					delta.unchanged.push({ name: name, value: oldValue })
				}
			}
		}
		if (old !== undefined || old !== null) {
			for (const name in old) {
				if (current[name] === undefined) {
					delta.remove.push({ name: name, old: old[name] })
				}
			}
		}
		return delta
	}

	public static getType (value: any):string {
		if (Array.isArray(value)) return 'array'
		if (typeof value === 'string') {
			// TODO determinar si es fecha.
			return 'string'
		}
		return typeof value
	}

	public static tryParse (value:string):any|null {
		try {
			return JSON.parse(value)
		} catch {
			return null
		}
	}

	public static dateFormat (value:any, format:string):string {
		return DateTime.fromISO(value).toFormat(format)
	}

	public static escape (value:string):string {
		return SqlString.escape(value)
	}

	public static tsType (value:string):string {
		switch (value) {
		case 'integer':
		case 'decimal':
			return 'number'
		case 'datetime':
		case 'date':
		case 'time':
			return 'Date'
		default:
			return value
		}
	}

	// https://stackoverflow.com/questions/27194359/javascript-pluralize-an-english-string
	/**
    * Returns the plural of an English word.
    *
    * @export
    * @param {string} word
    * @param {number} [amount]
    * @returns {string}
    */
	public static plural (word: string, amount?: number): string {
		if (amount !== undefined && amount === 1) {
			return word
		}
		const plural: { [key: string]: string } = {
			'(quiz)$': '$1zes',
			'^(ox)$': '$1en',
			'([m|l])ouse$': '$1ice',
			'(matr|vert|ind)ix|ex$': '$1ices',
			'(x|ch|ss|sh)$': '$1es',
			'([^aeiouy]|qu)y$': '$1ies',
			'(hive)$': '$1s',
			'(?:([^f])fe|([lr])f)$': '$1$2ves',
			'(shea|lea|loa|thie)f$': '$1ves',
			sis$: 'ses',
			'([ti])um$': '$1a',
			'(tomat|potat|ech|her|vet)o$': '$1oes',
			'(bu)s$': '$1ses',
			'(alias)$': '$1es',
			'(octop)us$': '$1i',
			'(ax|test)is$': '$1es',
			'(us)$': '$1es',
			'([^s]+)$': '$1s'
		}
		const irregular: { [key: string]: string } = {
			move: 'moves',
			foot: 'feet',
			goose: 'geese',
			sex: 'sexes',
			child: 'children',
			man: 'men',
			tooth: 'teeth',
			person: 'people'
		}
		const uncountable: string[] = [
			'sheep',
			'fish',
			'deer',
			'moose',
			'series',
			'species',
			'money',
			'rice',
			'information',
			'equipment',
			'bison',
			'cod',
			'offspring',
			'pike',
			'salmon',
			'shrimp',
			'swine',
			'trout',
			'aircraft',
			'hovercraft',
			'spacecraft',
			'sugar',
			'tuna',
			'you',
			'wood'
		]
		// save some time in the case that singular and plural are the same
		if (uncountable.indexOf(word.toLowerCase()) >= 0) {
			return word
		}
		// check for irregular forms
		for (const w in irregular) {
			const pattern = new RegExp(`${w}$`, 'i')
			const replace = irregular[w]
			if (pattern.test(word)) {
				return word.replace(pattern, replace)
			}
		}
		// check for matches using regular expressions
		for (const reg in plural) {
			const pattern = new RegExp(reg, 'i')
			if (pattern.test(word)) {
				return word.replace(pattern, plural[reg])
			}
		}
		return word
	}

	/**
    * Returns the singular of an English word.
    *
    * @export
    * @param {string} word
    * @param {number} [amount]
    * @returns {string}
    */
	public static singular (word: string, amount?: number): string {
		if (amount !== undefined && amount !== 1) {
			return word
		}
		const singular: { [key: string]: string } = {
			'(quiz)zes$': '$1',
			'(matr)ices$': '$1ix',
			'(vert|ind)ices$': '$1ex',
			'^(ox)en$': '$1',
			'(alias)es$': '$1',
			'(octop|vir)i$': '$1us',
			'(cris|ax|test)es$': '$1is',
			'(shoe)s$': '$1',
			'(o)es$': '$1',
			'(bus)es$': '$1',
			'([m|l])ice$': '$1ouse',
			'(x|ch|ss|sh)es$': '$1',
			'(m)ovies$': '$1ovie',
			'(s)eries$': '$1eries',
			'([^aeiouy]|qu)ies$': '$1y',
			'([lr])ves$': '$1f',
			'(tive)s$': '$1',
			'(hive)s$': '$1',
			'(li|wi|kni)ves$': '$1fe',
			'(shea|loa|lea|thie)ves$': '$1f',
			'(^analy)ses$': '$1sis',
			'((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
			'([ti])a$': '$1um',
			'(n)ews$': '$1ews',
			'(h|bl)ouses$': '$1ouse',
			'(corpse)s$': '$1',
			'(us)es$': '$1',
			s$: ''
		}
		const irregular: { [key: string]: string } = {
			move: 'moves',
			foot: 'feet',
			goose: 'geese',
			sex: 'sexes',
			child: 'children',
			man: 'men',
			tooth: 'teeth',
			person: 'people'
		}
		const uncountable: string[] = [
			'sheep',
			'fish',
			'deer',
			'moose',
			'series',
			'species',
			'money',
			'rice',
			'information',
			'equipment',
			'bison',
			'cod',
			'offspring',
			'pike',
			'salmon',
			'shrimp',
			'swine',
			'trout',
			'aircraft',
			'hovercraft',
			'spacecraft',
			'sugar',
			'tuna',
			'you',
			'wood'
		]
		// save some time in the case that singular and plural are the same
		if (uncountable.indexOf(word.toLowerCase()) >= 0) {
			return word
		}
		// check for irregular forms
		for (const w in irregular) {
			const pattern = new RegExp(`${irregular[w]}$`, 'i')
			const replace = w
			if (pattern.test(word)) {
				return word.replace(pattern, replace)
			}
		}
		// check for matches using regular expressions
		for (const reg in singular) {
			const pattern = new RegExp(reg, 'i')
			if (pattern.test(word)) {
				return word.replace(pattern, singular[reg])
			}
		}
		return word
	}
}
