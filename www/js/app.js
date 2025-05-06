// クラウドデータベースのREST APIのURI
const apiEndPoint = 'https://db.monaca.education/'
const apiMasterkey = "2b4a70e2-4b76-4ac4-a9a9-ef5e9b259c97";
//const baseUri = 'https://console.monaca.education/preview-content/6423a1bee788854e6beb2d3e/66b20529e78885541ac1a26b/www/js/';
const baseUri = 'https://direct-preview-66b20529e78885541ac1a26b.monaca.education/www/js/';

// クラウドデータベースのAPIKEY定義
const apiKeys = {
    "select": "77a3e657-e2e3-4a70-9f58-a2b9600027c3", 
    "insert": "998540ba-5c75-4838-8e13-11ee78ddf1b1",
    "update": "2b4a70e2-4b76-4ac4-a9a9-ef5e9b259c97",
    "delete": "2b4a70e2-4b76-4ac4-a9a9-ef5e9b259c97"
}

// 初回ページ表示時
function Load() {
    localStorage.clear();
    document.addEventListener("deviceready", onDeviceReady, false);

    document.getElementById('picture').src = '';
    document.getElementById('picture').style.display = "block"
    document.getElementById('sel1').options[0].selected = true;
    selectChange('sel1');

    DisplayListPage();
}

/* iOS Only */
function onDeviceReady() {
    console.log(navigator.camera);
}

// データ登録
function addTodo() {
    // 傘の所有者
    var owner = $("#todo-owner").val();
    // 傘の特徴
    var title = $("#todo-title").val();
    // 日時
    var todoDate = $("#todo-date").val();
    // 傘の補足情報
    var body = $("#todo-body").val();

    // テスト用傘画像で選択された画像の種類
    var select = document.getElementById('sel1'); // select object
    var option = select.options[select.selectedIndex];  // option object

    // Monaca DBに登録
    let url = "https://db.monaca.education/insert?apikey=" + apiKeys['insert'];
    url += "&text0=" + owner 
        + "&text1=" + title 
        + "&text2=" + todoDate
        + "&text3=" +  body 
        + "&text4=" +  option.value;
        
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            location.reload();
    });    

    // 一覧ページを表示
    DisplayListPage();
}

// 一覧ページ表示
function DisplayListPage() {
    $.mobile.changePage($("#list-page"));
    $("#todo-list").empty();

    // 初期化
    var dataKey = "";
    var targetValue = {
        "owner": "",
        "title": "",
        "todoDate": "",
        "body": ""
    };
    var targetImg = null;

    // データベースに保存してあるデータを取得する
    let url = "https://db.monaca.education/select?apikey=" + apiKeys['select'];
        
    fetch(url)
    .then(function(response) 
    {
        console.log("WebAPI のレスポンスです：",response);
        return response.json();
    })
    .then(function(db) 
    {
        console.log("JSON として受け取りました：",db);
        
        // 保存データ件数分表示する
        $("#todo-list").empty();

        for ( var i = 0; i < db.records.length; i++ )
        {
            // Monaca DB のレコードIDを取得する
            dataKey = db.records[i].id;

            // テスト用傘画像データ取得
            let imgData = GetImageTestData(db.records[i].text4);

            // Monaca DB に保存されているデータをHTMLで表示する
            $("#todo-list").append(                   
                "<li>" + 
                "<h3>所有者：" + db.records[i].text0 + "</h3>" + 
                "<h3>傘の特徴：" + db.records[i].text1 + "</h3>" + 
                "<h3>日時：" + db.records[i].text2 + "</h3>" + 
                "<img id='" + dataKey + '_img' + "' src='data:image/jpeg;base64," + imgData + "' width='150' height='150'><br>" +
                "<input type='button' value='表示' onclick='viewTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                "<input type='button' value='編集' onclick='editTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                "<input type='button' value='削除' onclick='deleteTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
            "</li>"); 
        }
    });  

    $("#todo-list").listview('refresh');
}

// データ登録ページへ遷移
function createTodo() {
    // データを取得

    // 入力ページへ
    $.mobile.changePage($("#add-page"));

    // 入力エリアを有効にする
    $("#todo-owner").prop('readonly',false);
    $("#todo-title").prop('readonly',false);
    $("#todo-date").prop('readonly',false);
    $("#todo-body").prop('readonly',false);

    // 値を設定する
    $("#todo-owner").val('');
    $("#todo-title").val('');
    $("#todo-date").val('');
    $("#todo-body").val('');
    document.getElementById('picture').style.display = "none";
    document.getElementById('picture').src = "";

    // 更新ボタン→登録ボタンに
    $('.ui-btn').attr('style','display: block');
    $("#addSave").val("登録").button("refresh");
    $("#addSave").attr("onClick", "addTodo('')").button("refresh");
}

// データ更新ページへ遷移
function editTodo(dataKey) {

    $("#todo-owner").val('');
    $("#todo-title").val('');
    $("#todo-date").val('');
    $("#todo-body").val('');
    $("#sel1").val('testdata1').change();

    // データベースに保存してあるデータを取得する
    let url = "https://db.monaca.education/select?apikey=" + apiKeys['select']
            + "&idIn=" + dataKey;
        
    fetch(url)
    .then(function(response) 
    {
        console.log("WebAPI のレスポンスです：",response);
        return response.json();
    })
    .then(function(db) 
    {
        // 値を設定する
        $("#todo-owner").val(db.records[0].text0);
        $("#todo-title").val(db.records[0].text1);
        $("#todo-date").val(db.records[0].text2);
        $("#todo-body").val(db.records[0].text3);
        $("#sel1").val(db.records[0].text4).change();
        selectChange('sel1');
    });

    // 入力ページへ
    $.mobile.changePage($("#add-page"));

    // 入力エリアを有効にする
    $("#todo-owner").prop('readonly',false);
    $("#todo-title").prop('readonly',false);
    $("#todo-date").prop('readonly',false);
    $("#todo-body").prop('readonly',false);

    // 登録ボタン→更新ボタンに
    $('.ui-btn').attr('style','display: block');
    $("#addSave").val("更新").button("refresh");
    $("#addSave").attr("onClick", "UpdateTodoData('" + dataKey + "')").button("refresh");
}

// データ更新処理
function UpdateTodoData(datakey) {

    // Monaca DBに対し、該当データを更新する
    let url = "https://db.monaca.education/update?apikey=" + apiKeys['update'] ;

    url += "&idIn=" + datakey
        + "&text0=" + $("#todo-owner").val() 
        + "&text1=" + $("#todo-title").val() 
        + "&text2=" + $("#todo-date").val()
        + "&text3=" +  $("#todo-body").val() 
        + "&text4=" +  $("#sel1").val();
        
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            // 一覧ページを表示
            DisplayListPage();
    }); 
}

function deleteTodo(datakey) {
    let ret = confirm('削除しても宜しいですか？');
    if ( ret == false ) 
    {
        return;
    }

    // Monaca DBに対し、該当データを削除する
    let url = "https://db.monaca.education/delete?apikey=" + apiKeys['delete']
             + "&idIn=" + datakey;
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            // 一覧ページを表示
            DisplayListPage();
    });   
}

// 表示ボタンクリック時（表示モードページへ）
function viewTodo(dataKey) {

    // 入力ページへ
    $.mobile.changePage($("#add-page"));

    // Monaca DBに対し、該当データを取得する
    let url = "https://db.monaca.education/select?apikey=" + apiKeys['select']
             + "&idIn=" + dataKey;

    fetch(url)
    .then(function(response) 
    {
        console.log("WebAPI のレスポンスです：",response);
        return response.json();
    })
    .then(function(db) 
    {
        // 値を設定する
        $("#todo-owner").val(db.records[0].text0);
        $("#todo-title").val(db.records[0].text1);
        $("#todo-date").val(db.records[0].text2);
        $("#todo-body").val(db.records[0].text3);
        $("#sel1").val(db.records[0].text4).change();
        selectChange('sel1');
    });

    // 入力エリアを読み取り専用にする
    $("#todo-owner").prop('readonly',true);
    $("#todo-title").prop('readonly',true);
    $("#todo-date").prop('readonly',true);
    $("#todo-body").prop('readonly',true);

    // 登録ボタンを非表示にする
    $('.ui-btn').attr('style','display: none');
    // 上記で登録ボタンを非表示にすると「戻る」ボタンまで非表示になるため、戻るボタンは表示するようにする
    $('.ui-btn-left').attr('style','display: block');
}

// 戻るボタンクリック時
function backPage() {
    // 登録ボタンを表示にする
    $('.ui-btn').attr('style','display: block');
    // 「戻る」ボタンまで非表示にする
    $('.ui-btn-left').attr('style','display: none');    
}

/**
 * Date オブジェクトを yyyyMMddHHmmss 形式の文字列に変換
 * @param {Date} date 変換対象の Date オブジェクト
 */
function dateToString(date) {
    const strYear = String(date.getFullYear()).padStart(4, '0')
    const strMonth = String(date.getMonth()).padStart(2, '0')
    const strDate = String(date.getDate()).padStart(2, '0')
    const strHour = String(date.getHours()).padStart(2, '0')
    const strMin = String(date.getMinutes()).padStart(2, '0')
    const strSec = String(date.getSeconds()).padStart(2, '0')
    return strYear + strMonth + strDate + strHour + strMin + strSec
}

/* コンボボックスで選択したテスト用傘画像を表示する */
function selectChange(id) {
    var select = document.getElementById(id); // select object
    var option = select.options[select.selectedIndex];  // option object

    let imgTestDataFile = baseUri + option.value;

    var request = new XMLHttpRequest();
    request.open('GET', imgTestDataFile, false);

    request.onreadystatechange = function()
    {
        if(request.readyState === 4)
        {
            if(request.status === 200 || request.status == 0)
            {
                var imageData = request.responseText;
                document.getElementById('picture').style.display = "block";
                document.getElementById('picture').src = "data:image/jpeg;base64," + imageData;
            }
        }
    }
    request.send();
}

// テスト用傘画像データ取得
function GetImageTestData(dataname) 
{
    let imgTestDataFile = baseUri + dataname;
    let imageData = null;

    var request = new XMLHttpRequest();
    request.open('GET', imgTestDataFile, false);

    request.onreadystatechange = function()
    {
        if(request.readyState === 4)
        {
            if(request.status === 200 || request.status == 0)
            {
                imageData = request.responseText;
            }
        }
    }
    request.send();
    
    return imageData;
}
