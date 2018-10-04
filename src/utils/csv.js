import _ from 'underscore'

function csv_escape_and_wrap(val) {
  const escaped = (val == null) ? val : val.replace(/"/g, "'") // repace inverted commas with single quotes
  return '"' + escaped + '"'; // wrap in inverted commas
}

function get_csv_row(row) {
  return row.map(function(val) {
    return _.isNumber(val) ? val : csv_escape_and_wrap(val); // if not a number, then escape and wrap
  }).join(','); // join with a comma
}

export function get_csv_string(rows) {
  const csv_rows = rows.map(get_csv_row)
  return csv_rows.join('\n')
}

export function CSVtoArray(text) {
  const re_valid =  /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/
  const re_value =  /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g
  if (!re_valid.test(text)) return null
  let a = []
  text.replace(re_value,
    function(m0, m1, m2, m3) {
      if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"))
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'))
      else if (m3 !== undefined) a.push(m3);
      return ''
    })
  if (/,\s*$/.test(text)) a.push('')
  return a
}