import React from 'react'
import Dropzone from 'react-dropzone'
import csvIcon from '../resources/icons/csv-icon.svg'
import xlsxIcon from '../resources/icons/xls-icon.svg'
import fileUploadIcon from '../resources/icons/file-upload.svg'
import logger from "../Utils/logger";
import Papa from "papaparse";
import moment from "moment/moment";
import {Icon} from 'semantic-ui-react'
import XLSX from 'xlsx'

/**
 * Props:
 *  + width: width of a box in pixels (e.g '400' - default '300')
 *  + height: height of a box in pixels (e.g '400' - default '200')
 *  + onFileDrop(file): called after the file is dropped / uploaded
 *  + onParsingComplete(firebaseUploadData, parsingResult): called after the parsing of the file is
 *    complete. filebaseUploadData is the object upload to Firebase, parsingResult is a string of parsing result
 */

export default class CustomisedDropzone extends React.Component {
	constructor(props) {
		super(props)

		var initialState = {
			uploadedFile: null,
			uploadedFileType: null,
			isDropzoneEnabled: true,
			parsingResult: null
		}

		// set width and height for the drop zone
		if (!props.width) {
			initialState['width'] = '300px'
			initialState['dropzoneIconWidth'] = '75px'
		} else {
			let widthString = props.width
			let dropzoneIconWidthString = (parseInt(widthString) * 0.75).toString() + 'px'
			initialState['width'] = widthString + 'px'
			initialState['dropzoneIconWidth'] = dropzoneIconWidthString
		}

		if (!props.height) {
			initialState['height'] = '200px'
			initialState['uploadedFileIconHeightString'] = '100px'
		} else {
			let heightString = props.height
			let uploadedFileIconHeightString = (parseInt(heightString) * 0.5).toString() + 'px'
			initialState['height'] = props.height + 'px'
			initialState['uploadedFileIconHeightString'] = uploadedFileIconHeightString
		}

		this.state = initialState
	}

	render() {
		return (
			<span style={{display: 'inline-flex', alignItems: 'center'}}>
			<div>
				<Dropzone onDrop={this.onFileDrop} disabled={!this.state.isDropzoneEnabled}
				    style={{
				    	height: this.state.height,
					    width: this.state.width,
					    borderColor: '#CADBE0',
					    borderStyle: 'dashed'
				    }}
				>
					<div style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<img src={fileUploadIcon}
						     style={{
						     	width: this.state.dropzoneIconWidth
						     }}
						/>
						<br/>
						<div><b>Choose a file </b>or drag it here</div>
					</div>
				</Dropzone>
			</div>

				{
					this.state.uploadedFileType ? (
						<Icon name={'arrow right'} color={'#CADBE0'} size={'big'}/>
					) : null
				}

				{
					this.state.uploadedFile ? (
						<div style={{
							height: this.state.height,
							width: this.state.width,
							borderColor: '#CADBE0',
							borderStyle: 'solid',
							padding: '10px'
						}}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								{this.state.uploadedFileType === 'excel' ?
									<img src={xlsxIcon} style={{height: this.state.uploadedFileIconHeightString, marginRight: '10px'}}/> : null}
								{this.state.uploadedFileType === 'csv' ?
									<img src={csvIcon} style={{height: this.state.uploadedFileIconHeightString, marginRight: '10px'}}/> : null}
								<p style={{textAlign: 'left'}}>Uploaded file: <b>{this.state.uploadedFile.name}</b></p>
							</div>
							<br/>
							{
								this.state.parsingResult ? (
									<div>{this.state.parsingResult}</div>
								) : (
									<div>Parsing file...</div>
								)
							}
						</div>
					) : null
				}

				{
					this.state.uploadedFileType === 'unsupported' ? (
						<div style={{
							height: this.state.height,
							width: this.state.width,
							border: 'solid',
							borderColor: '#CADBE0',
							padding: '10px'
						}}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
								height: '100%'
							}}
							>
								<Icon name={'warning circle'} color={'red'} size={'huge'}/>
								<br/>
								<p>The uploaded file type is not supported</p>
							</div>
						</div>
					) : null
				}
		</span>
		)
	}

	onFileDrop = (acceptedFiles, rejectedFiles) => {
		logger(acceptedFiles[0], 'accepted file')
		if (this.isSupportedFileTypes(acceptedFiles[0].name)) {
			this.setState({
				uploadedFile: acceptedFiles[0],
				isDropzoneEnabled: false,
				isParsing: true,
				parsingResult: null
			})
			this.props.onFileDrop(acceptedFiles[0])
			this.parseUploadedFile(acceptedFiles[0])
		} else {
			this.props.onFileDrop(null)
			this.setState({
				uploadedFile: null
			})
		}
	}

	parseUploadedFile = (file) => {
		if (this.isCsv(file.name)) {
			Papa.parse(file, {
				complete: results => {
					logger("papaparse results", results)

					let firebaseUploadData = {}

					var validRows = 0
					var invalidRows = 0

					Object.keys(results.data).map(key => {
						if (results.data[key].length === 1 && results.data[key][0] === '') return

						let code = results.data[key][0]
						let startDate = results.data[key][1]
						let endDate = results.data[key][2]
						let useCount = parseInt(results.data[key][3])

						var validationResult = this.validateInput(code, startDate, endDate, useCount)

						if (validationResult.isValid) {
							firebaseUploadData[code] = {
								start_date: startDate,
								end_date: endDate,
								use_count: useCount
							}
							validRows++
						} else {
							invalidRows++
						}

						this.setState({
							isParsing: false,
							isDropzoneEnabled: true,
							parsingResult: this.getParsingResult(invalidRows, validRows),
							eventData: firebaseUploadData
						})
					})

					logger('firebase data upload object', firebaseUploadData)
					logger('valid rows: ' + validRows)
					logger('invalid rows: ' + invalidRows)

					this.props.onParsingComplete(firebaseUploadData, this.getParsingResult(invalidRows, validRows))
				}
			})
		} else if (this.isExcelSheet(file.name)) {
			var reader = new FileReader()

			reader.onload = (e) => {
				var workbook
				try {
					workbook = XLSX.read(reader.result, {type: 'array'})
				} catch (e) {
					this.setState({
						status: 'DONE',
						errorType: 'READ_SHEET_FAIL',
						errorDetails: 'Failed to read Excel file'
					})
					return
				}

				var csvString
				try {
					csvString = XLSX.utils.sheet_to_csv(workbook.Sheets['codes'])
				} catch (e) {
					this.setState({
						status: 'DONE',
						errorType: 'NO_CODE_SHEET',
						errorDetails: "Failed to find a 'codes' sheet",
					})
					return
				}
				Papa.parse(XLSX.utils.sheet_to_csv(workbook.Sheets['codes']), {
					complete: results => {
						logger("papaparse results", results)

						let firebaseUploadData = {}

						var validRows = 0
						var invalidRows = 0

						Object.keys(results.data).map(key => {
							let code = results.data[key][0]
							let startDate = results.data[key][1]
							let endDate = results.data[key][2]
							let useCount = parseInt(results.data[key][3])

							var validationResult = this.validateInput(code, startDate, endDate, useCount)

							if (validationResult.isValid) {
								firebaseUploadData[code] = {
									start_date: startDate,
									end_date: endDate,
									use_count: useCount
								}
								validRows++
							} else {
								invalidRows++
							}
						})

						logger('firebase data upload object', firebaseUploadData)

						this.props.onParsingComplete(firebaseUploadData, this.getParsingResult(invalidRows, validRows))

						this.setState({
							isParsing: false,
							isDropzoneEnabled: true,
							parsingResult: this.getParsingResult(invalidRows, validRows),
							eventData: firebaseUploadData
						})
					}
				})
			}
			reader.readAsArrayBuffer(file)
		}
	}

	validateInput = (code, _startDate, _endDate, useCount) => {
		//initial state check
		var validationResult = {
			isValid: true
		}

		if (!code || !_startDate || !_endDate || !useCount) {
			console.log("Input is validated -> uninitialized")
			validationResult = {
				...validationResult, missingFields: true, isValid: false
			}
			return validationResult
		}

		//check start/end date format
		//check end date is after start date
		var startDate = moment(_startDate, "DD/MM/YYYY", true)
		var endDate = moment(_endDate, "DD/MM/YYYY", true)

		if (!startDate.isValid() || !endDate.isValid()) {
			console.log("Input is validated -> dates format wrong")
			validationResult = {
				...validationResult, datesFormatWrong: true, isValid: false
			}
		} else if (endDate.isBefore(startDate)) {
			console.log("Input is validated -> end before start")
			validationResult = {
				...validationResult, startDateAfterEndDate: true, isValid: false
			}
		}

		//check use count
		if (!Number.isInteger(useCount) || useCount < 0) {
			console.log("Input is validated -> use count format wrong")
			validationResult = {
				...validationResult, useCountWrongFormat: true, isValid: false
			}
		}

		// check if QR contains illegal characters
		// Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
		if (code.includes('.') || code.includes('#')
			|| code.includes('$') || code.includes('[')
			|| code.includes(']') || code === '') {
			console.log("Input is validated -> illegal characters in code")
			validationResult = {
				...validationResult, codeIllegalChar: true, isValid: false
			}
		}

		console.log('At the end of validity check: isValid is ' + validationResult.isValid)
		return validationResult
	}

	isCsv = (fileName) => {
		return fileName.toLowerCase().endsWith('.csv')
	}

	isExcelSheet = (fileName) => {
		return fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls')
	}

	isSupportedFileTypes = (fileName) => {
		if (this.isCsv(fileName)) {
			this.setState({
				uploadedFileType: 'csv'
			})
			return true
		}
		else if (this.isExcelSheet(fileName)) {
			this.setState({
				uploadedFileType: 'excel'
			})
			return true
		} else {
			this.setState({
				uploadedFileType: 'unsupported'
			})
			return false
		}
	}

	getParsingResult = (invalidRows, validRows) => {
		return 'This file contains ' + validRows + ' valid row' + (validRows > 1 ? 's ' : ' ') + 'and ' + invalidRows + ' invalid row' + (invalidRows > 1 ? 's ' : ' ')
	}
}

