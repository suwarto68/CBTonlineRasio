export const APPSCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT - CBT ANBK SMP NEGERI 1 WANARAYA
 * Tahun Ajaran 2026/2027
 * 
 * Fitur:
 * 1. Ping / Indikator status koneksi ke Google Spreadsheet
 * 2. Tarik Data Siswa dari sheet 'UserLogin'
 * 3. Simpan Jawaban Ujian ke sheet 'JawabanUjian'
 *    (Menyimpan: Waktu, Kode Siswa, Nama Peserta, Kelas, Token, Skor Akhir, Jawaban No 1-20)
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "ping") {
    return createJsonResponse({
      status: "success",
      message: "Terhubung ke Google Spreadsheet SMPN 1 Wanaraya",
      spreadsheetName: ss.getName(),
      timestamp: new Date().toISOString()
    });
  }
  
  if (action === "getUsers") {
    var sheet = getOrCreateSheet(ss, "UserLogin", ["Kode", "Nama", "Username", "Password", "Kelas"]);
    var data = sheet.getDataRange().getValues();
    var users = [];
    
    // Baris 0 adalah Header: Kode, Nama, Username, Password, Kelas
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] || data[i][2]) {
        users.push({
          code: String(data[i][0]),
          name: String(data[i][1]),
          username: String(data[i][2]),
          password: String(data[i][3]),
          classRoom: String(data[i][4])
        });
      }
    }
    
    return createJsonResponse({
      status: "success",
      count: users.length,
      users: users
    });
  }
  
  return createJsonResponse({ status: "error", message: "Action tidak dikenal" });
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    var sheet = getOrCreateSheet(ss, "JawabanUjian", [
      "Waktu_Submit",
      "Kode_Siswa",
      "Nama_Peserta",
      "Kelas",
      "Token",
      "Skor_Akhir",
      "Jumlah_Benar",
      "Total_Soal",
      "Durasi_Menit",
      "No_1", "No_2", "No_3", "No_4", "No_5",
      "No_6", "No_7", "No_8", "No_9", "No_10",
      "No_11", "No_12", "No_13", "No_14", "No_15",
      "No_16", "No_17", "No_18", "No_19", "No_20"
    ]);
    
    var waktuSekarang = Utilities.formatDate(new Date(), "Asia/Makassar", "yyyy-MM-dd HH:mm:ss");
    
    // Siapkan baris data
    var row = [
      waktuSekarang,
      data.studentCode || "-",
      data.studentName || "-",
      data.classRoom || "-",
      data.token || "-",
      data.score !== undefined ? data.score : 0,
      data.correctCount !== undefined ? data.correctCount : 0,
      data.totalQuestions !== undefined ? data.totalQuestions : 20,
      data.durationMinutes !== undefined ? data.durationMinutes : 0
    ];
    
    // Masukkan jawaban soal 1 s/d 20
    var answers = data.answersSummary || {};
    for (var n = 1; n <= 20; n++) {
      var ans = answers[n];
      if (ans === undefined || ans === null) {
        row.push("-");
      } else if (typeof ans === "object") {
        row.push(JSON.stringify(ans));
      } else {
        row.push(String(ans));
      }
    }
    
    sheet.appendRow(row);
    
    return createJsonResponse({
      status: "success",
      message: "Data ujian berhasil disimpan ke sheet JawabanUjian",
      studentName: data.studentName,
      score: data.score
    });
    
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

// Fungsi bantu membuat sheet jika belum ada + header
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1565c0");
      headerRange.setFontColor("#ffffff");
    }
  }
  return sheet;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
