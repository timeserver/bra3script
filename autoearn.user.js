// ==UserScript==
// @name         AutoEarn
// @namespace    http://pok.jp
// @description  this script auto dispatch soldier, and invoke
// @include      http://*.3gokushi.jp/card/deck.php*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==


(function() {
//  console.log("call");
  var SAVE_PREFIX = "AutoEarn";
  var min = true;
  var eleDeck = document.evaluate('//div[@id="cardListDeck"]/form/div', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
//  console.log(((eleDeck.snapshotItem(0).getElementsByTagName('dd')[0]).getElementsByTagName('div')[0]).childNodes[0].nodeValue);
//  console.log((eleDeck.snapshotItem(0).getElementsByTagName('dd')[2]).childNodes[0].nodeValue);
//    console.log(eleDeck.snapshotItem(0).getElementsByTagName('div')[7]);
//  ((eleDeck.snapshotItem(0).getElementsByTagName('div')[7]).getElementsByTagName('img')[0]).onclick.toString().match(/operationExecution|.*?, (.*?), .*?/);
//  console.log(RegExp.$1);

  // Common function
  var functionAddGlobalStyle = function (css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  var functionCreateCheck = function (id, name, value, text, checked) {
    var d = document.createElement("div");
    d.style.padding = "2px";

    var r = document.createElement("input");
    r.type = "checkbox";
    r.id = id;
    r.name = name;
    r.value = value;
    r.checked = checked;

    var l = document.createElement("label");
    l.htmlFor = id;
    var t = document.createTextNode(text);
    l.appendChild(t);

    d.appendChild(r);
    d.appendChild(l);
    return d;
  }

  var functionCreateTextBox = function (id, name, text, size) {
    var d = document.createElement("div");
    d.style.padding = "2px";
    d.style.display = "inline";

    var l = document.createElement("label");
    l.htmlFor = id;
    var t = document.createTextNode(text);
    l.appendChild(t);
 
    var r = document.createElement("input");
    r.type = "text";
    r.id = id;
    r.name = name;
    r.size = size;

    d.appendChild(l);
    d.appendChild(r);
    return d;
  }

  // Create popup window
  var divPopup = document.createElement("div");
  divPopup.id = "popup";
  document.body.appendChild(divPopup);

  // Create popup window header
  var divHeader = document.createElement("div");
  divHeader.id = "popup_header";
  divPopup.appendChild(divHeader);

  // Create popup window body
  var divBody = document.createElement('div');
  divBody.id = "popup_body";
  divPopup.appendChild(divBody);

  // Create popup window footer
  var divFooter = document.createElement("div");
  divFooter.id = "popup_footer";
  divPopup.appendChild(divFooter);

  var divClose = document.createElement("div");
  divClose.id = "popup_close";
  divClose.innerHTML = "×";
  divHeader.appendChild(divClose);

  var divMin = document.createElement("div");
  divMin.id = "popup_min";
  divMin.innerHTML = "▼";
  divHeader.appendChild(divMin);

  var divTitle = document.createElement("div");
  divTitle.id = "popup_title";
  divTitle.innerHTML = "自動ツール";
  divHeader.appendChild(divTitle);

  var divDispatchSoldier = document.createElement("div");
  var buttonDispatchSoldier = document.createElement("input");
  buttonDispatchSoldier.type = "button";
  buttonDispatchSoldier.id = "button_dispatch_soldier";
//  buttonDispatchSoldier.value = "出兵";
  buttonDispatchSoldier.value = "TP";
  var buttonDispatchSoldierAll = document.createElement("input");
  buttonDispatchSoldierAll.type = "button";
  buttonDispatchSoldierAll.id = "button_dispatch_soldier_all";
  buttonDispatchSoldierAll.value = "出兵";
  divDispatchSoldier.appendChild(functionCreateTextBox("x_dispatch_soldier", "x_dispatch_soldier", "x:", 4));
  divDispatchSoldier.appendChild(functionCreateTextBox("y_dispatch_soldier", "y_dispatch_soldier", "y:", 4));
  divDispatchSoldier.appendChild(buttonDispatchSoldier);
  divDispatchSoldier.appendChild(buttonDispatchSoldierAll);

  var buttonInvoke = document.createElement("input");
  buttonInvoke.type = "button";
  buttonInvoke.id = "button_invoke";
//  buttonInvoke.value = "祈祷";
  buttonInvoke.value = "BP";

  var buttonSave = document.createElement("input");
  buttonSave.type = "button";
  buttonSave.id = "button_save";
  buttonSave.value = "保存";

  divBody.appendChild(divDispatchSoldier);
  divBody.appendChild(buttonInvoke);

  divFooter.appendChild(functionCreateCheck("default_min", "default_min", 1, "初期最小化", false));
  divFooter.appendChild(buttonSave);

  // main
  functionAddGlobalStyle('#popup { background-color: #CCCCFF; width: 190px; border: 1px solid #000000; position: absolute; display: none; z-index: 1000; }');
  functionAddGlobalStyle('#popup_body { padding: 5px; font-size:10px; }');
  functionAddGlobalStyle('#popup_footer { padding: 5px; font-size:10px; }');
  functionAddGlobalStyle('#popup_title { padding: 2px; background-color: #9999FF; cursor: move; font-weight: bold; }');
  functionAddGlobalStyle('#popup_min { padding: 2px; cursor: pointer; float: right; }');
  functionAddGlobalStyle('#popup_close { padding: 2px; cursor: pointer; float: right; }');

  $('#button_dispatch_soldier').click(function() {
    for (var i = 0; i < eleDeck.snapshotLength; ++i) {
//      console.log(((eleDeck.snapshotItem(i).getElementsByTagName('dd')[0]).getElementsByTagName('div')[0]).childNodes[0].nodeValue.slice(0, -1));
      if (((eleDeck.snapshotItem(i).getElementsByTagName('dd')[0]).getElementsByTagName('div')[0]).childNodes[0].nodeValue.slice(0, -1) == "500" && 
          (eleDeck.snapshotItem(i).getElementsByTagName('dd')[2]).childNodes[0].nodeValue == "\n待機中") {
        var controllPos = 0;
        for (var j = 0; j < 25; ++j) {
          if ((eleDeck.snapshotItem(i).getElementsByTagName('div')[j]).className == "control") {
            controllPos = j;
            break;
          }
        }

        ((eleDeck.snapshotItem(i).getElementsByTagName('div')[controllPos]).getElementsByTagName('img')[0]).getAttribute("onclick").toString().match(/operationExecution|.*?, (.*?), .*?/);
        var cardId = RegExp.$1;
//        console.log("id:" + cardId + "  x:" + $('#x_dispatch_soldier').val() + "  y" + $('#y_dispatch_soldier').val());

        setTimeout(function(cardId) {$.ajax({
          type: "POST",
          url: "/facility/castle_send_troop.php#ptop",
          data: {
            village_name: "",
            village_x_value: $('#x_dispatch_soldier').val().toString(),
            village_y_value: $('#y_dispatch_soldier').val().toString(),
            unit_assign_card_id: cardId,
            radio_move_type: "302",
            show_beat_bandit_flg: "1",
            infantry_count: "",
            spear_count: "",
            archer_count: "",
            cavalry_count: "",
            halbert_count: "",
            crossbow_count: "",
            cavalry_guards_count: "",
            scout_count: "",
            cavalry_scout_count: "",
            ram_count: "",
            catapult_count: "",
            radio_reserve_type: "0",
            x: "",
            y: "",
            card_id: "204",
            btn_send: "出兵"
          }
        });}, i * 1000, cardId);
      }
    }
  });

  $('#button_dispatch_soldier_all').click(function() {
    for (var i = 0; i < eleDeck.snapshotLength; ++i) {
      if ((eleDeck.snapshotItem(i).getElementsByTagName('dd')[2]).childNodes[0].nodeValue == "\n待機中") {
        var controllPos = 0;
        for (var j = 0; j < 25; ++j) {
          if ((eleDeck.snapshotItem(i).getElementsByTagName('div')[j]).className == "control") {
            controllPos = j;
            break;
          }
        }

        ((eleDeck.snapshotItem(i).getElementsByTagName('div')[controllPos]).getElementsByTagName('img')[0]).getAttribute("onclick").toString().match(/operationExecution|.*?, (.*?), .*?/);
        var cardId = RegExp.$1;
//        console.log("id:" + cardId + "  x:" + $('#x_dispatch_soldier').val() + "  y" + $('#y_dispatch_soldier').val());

        setTimeout(function(cardId) {$.ajax({
          type: "POST",
          url: "/facility/castle_send_troop.php#ptop",
          data: {
            village_name: "",
            village_x_value: $('#x_dispatch_soldier').val().toString(),
            village_y_value: $('#y_dispatch_soldier').val().toString(),
            unit_assign_card_id: cardId,
            radio_move_type: "302",
            show_beat_bandit_flg: "1",
            infantry_count: "",
            spear_count: "",
            archer_count: "",
            cavalry_count: "",
            halbert_count: "",
            crossbow_count: "",
            cavalry_guards_count: "",
            scout_count: "",
            cavalry_scout_count: "",
            ram_count: "",
            catapult_count: "",
            radio_reserve_type: "0",
            x: "",
            y: "",
            card_id: "204",
            btn_send: "出兵"
          }
        });}, i * 1000, cardId);
      }
    }
  });

  $('#button_invoke').click(function() {
    for (var i = 0; i < 5; ++i) {
      setTimeout(function() {$.ajax({
        url: "/alliance/village.php?assist=1"
      });}, i * 1000);
    }
  });

  $('#button_save').click(function() {
    GM_setValue(SAVE_PREFIX + "_dispatchSoldierX", $('#x_dispatch_soldier').val());
    GM_setValue(SAVE_PREFIX + "_dispatchSoldierY", $('#y_dispatch_soldier').val());
    if ($('#default_min').is(':checked')) {
      GM_setValue(SAVE_PREFIX + "_defaultMin", 1);
    } else {
      GM_setValue(SAVE_PREFIX + "_defaultMin", 0);
    }
  });

  $.popup = function() {
    var wx, wy;
    var mx, my;

    wx = $('#cardListDeck').offset().left + 150;
    wy = $('#cardListDeck').offset().top - 30;

    $('#popup').css('top', wy).css('left', wx).fadeIn(100);
    // min button
    $('#popup_min').click(function() {
      if (min) {
        $('#popup_body').css("display", "none");
        $('#popup_footer').css("display", "none");
        min = false;
      } else {
        $('#popup_body').css("display", "table");
        $('#popup_footer').css("display", "table");
        min = true;
      }
    });
    // close button
    $('#popup_close').click(function() {$('#popup').fadeOut(100);});
    // タイトルバーをドラッグしたとき
    $('#popup_title').mousedown(function(e) {
      mx = e.pageX;
      my = e.pageY;
      $().mousemove(mouseMove).mouseup(mouseUp);
      return false;
    });
    function mouseMove(e) {
      wx += e.pageX - mx;
      wy += e.pageY - my;
      $('#popup').css('top', wy).css('left', wx);
      mx = e.pageX;
      my = e.pageY;
      return false;
    }
    function mouseUp() {
      $().unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
    }
  }

  // Restore
  if (eval("("+GM_getValue(SAVE_PREFIX + "_defaultMin")+")") == 1) {
    $('#default_min').attr({checked: "checked"});
    $('#popup_body').css("display", "none");
    $('#popup_footer').css("display", "none");
    min = false;
  }

  if (GM_getValue(SAVE_PREFIX + "_dispatchSoldierX") != undefined) {
    $('#x_dispatch_soldier').val(eval("("+GM_getValue(SAVE_PREFIX + "_dispatchSoldierX")+")"));
  }
  if (GM_getValue(SAVE_PREFIX + "_dispatchSoldierX") != undefined) {
    $('#y_dispatch_soldier').val(eval("("+GM_getValue(SAVE_PREFIX + "_dispatchSoldierY")+")"));
  }

  // output
  $.popup();
})();
