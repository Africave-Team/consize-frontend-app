// utils/parseFile.ts
import { EnrollmentField } from '@/type-definitions/secure.courses'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface ParsedData {
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
}


export const toCamelCase = (str: string) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

const parseFile = (file: File, fields: EnrollmentField[]): Promise<ParsedData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result as string

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        Papa.parse(result, {
          header: true,
          skipEmptyLines: true,
          complete: (parsedData) => {
            let mappedData: ParsedData[] = parsedData.data.map((row: any) => {
              let values: any = {
              }
              for (let field of fields) {
                values[toCamelCase(field.fieldName)] = row[field.fieldName]
              }
              return values
            })
            resolve(mappedData)
          }, // @ts-ignore
          error: (error) => {
            reject(error.message)
          },
        })
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        // Parse Excel
        const workbook = XLSX.read(result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })

        // Assuming the first row contains headers (column names)
        const headerRow: string[] = excelData[0] as string[]
        const requiredColumns = fields.map(e => e.fieldName)
        if (requiredColumns.every((column) => headerRow.includes(column))) {
          excelData.shift() // Remove header row

          try {
            const mappedData: ParsedData[] = excelData.map((row: any) => {
              let values: any = {
              }
              for (let field of fields) {
                values[toCamelCase(field.fieldName)] = row[headerRow.indexOf(field.fieldName)]
              }
              return values
            })
            resolve(mappedData.filter((e: any) => e[toCamelCase(fields[0].fieldName)] !== undefined))
          } catch (error) {
            console.log(error)
            reject((error as any).message)
          }
        } else {
          reject('Required columns not found')
        }
      } else {
        reject('Unsupported file format')
      }
    }

    reader.readAsBinaryString(file)
  })
}

export default parseFile
