import * as XLSX from 'xlsx-js-style'

const createWorkbook = ({ statsData, tableData }: { statsData?: RowData[][]; tableData?: RowData[][] }) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()
  if (statsData) {
    const ws = XLSX.utils.aoa_to_sheet(statsData)
    const colWidths = [
      { wch: 35 }, // Width of column A (Name)
      { wch: 40 }, // Width of column B (Age)
    ]

    // Apply column widths to the worksheet
    ws['!cols'] = colWidths
    XLSX.utils.book_append_sheet(workbook, ws, "Course Statistics")
  }

  if (tableData) {
    // Create a worksheet for Sheet 2
    const sheet2 = XLSX.utils.aoa_to_sheet(tableData)

    const colWidths2 = [
      { wch: 50 }, // Width of column A (Name)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 30 }, // Width of column B (Age)
    ]

    // Apply column widths to the worksheet
    sheet2['!cols'] = colWidths2
    // Add Sheet 2 to the workbook
    XLSX.utils.book_append_sheet(workbook, sheet2, 'Course Students')

  }


  return workbook
}

const createSampleWorkbook = ({ tableData }: { tableData?: RowData[][] }) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  if (tableData) {
    // Create a worksheet for Sheet 2
    const sheet2 = XLSX.utils.aoa_to_sheet(tableData)

    const colWidths2 = [
      { wch: 50 }, // Width of column A (Name)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 40 }, // Width of column B (Age)
      { wch: 30 }, // Width of column B (Age)
    ]

    // Apply column widths to the worksheet
    sheet2['!cols'] = colWidths2
    // Add Sheet 2 to the workbook
    XLSX.utils.book_append_sheet(workbook, sheet2, 'Sample learner group data')

  }


  return workbook
}

export interface RowData {
  v: string
  t: string
  s?: {
    font?: {
      bold?: boolean
      color?: {
        rgb: string
      }
      sz?: number
    }
    fill?: {
      patternType?: "solid" | "none"
      fgColor?: {
        rgb?: string
      }
      bgColor?: {
        rgb?: string
      }
    }
  }
}

interface ExportHandlerInterface {
  name: string
  statsData?: RowData[][]
  tableData?: RowData[][]
}

export const handleExport = ({ name, statsData, tableData }: ExportHandlerInterface) => {
  // Create the workbook
  const workbook = createWorkbook({ statsData, tableData })

  // Save the workbook to a file
  XLSX.writeFile(workbook, `${name}.xlsx`)
}



export const exportSampleData = ({ name, tableData }: ExportHandlerInterface) => {
  // Create the workbook
  const workbook = createSampleWorkbook({ tableData })

  // Save the workbook to a file
  XLSX.writeFile(workbook, `${name}.xlsx`)
}
