var page=0;
function animal_select(index, animalNameEn, animalNameDe) {
  sessionStorage.setItem("index", index);
  sessionStorage.setItem("animalNameEn", animalNameEn);
  sessionStorage.setItem("animalNameDe", animalNameDe);
  show_cuts_view();
}

function cut_select(cutCode, cutName) {
  sessionStorage.setItem("cutCode", cutCode);
  sessionStorage.setItem("cutName", cutName);
  show_parameter_view();
}

function show_cuts_view() {
  $("#animalSelectView").hide();
  $("#parameterSelectView").hide();
  $("#cutSelectView").show();
  $("#animalNameEn").text(sessionStorage.getItem("animalNameEn"));
  show_cut_list();
  page=1;
}
function show_parameter_view() {
  $("#cutSelectView").hide();
  $("#parameterSelectView").show();
  $("#animalName").text(sessionStorage.getItem("animalNameEn"));
  $("#cutName").text(sessionStorage.getItem("cutName"));
  configureInputField();
  page=2;
}

function show_animal_view() {
  $("#cutSelectView").hide();
  $("#parameterSelectView").hide();
  $("#animalSelectView").show();
  page=0;
}
show_animal_view();

function goBack() {
  if (page == 1) {
    show_animal_view();
  } else if (page == 2) {
    show_cuts_view();
  }
}

function show_cut_list() {
  $.ajax({
    url: "../data.json",
    async: false,
    dataType: "json",
    success: function (response) {
      // do stuff with response.
      let index = sessionStorage.getItem("index");
      var cutList = [];
      $("#cutList").empty();
      for (let cutCode in response[index].cuts) {
        for (let i in response[index].cuts[cutCode].name.en) {
          let cutName = response[index].cuts[cutCode].name.en[i];
          //   let cutName = response[index]["cuts"][cutCode]["name"]["en"][j];
          cutItem =
            '<div class="row cutList" style="padding: 2px; padding-top: 2px"><div class="detail-grid-option"><a href="javascript:cut_select(\'' +
            cutCode +
            "','" +
            cutName +
            "')\"><h4 class='cutName'>" +
            cutName +
            "</h4></a></div></div>";
          $("#cutList").append(cutItem);
        }
      }
    },
  });
}

function searchCuts() {
  var input, filter, divList, li, a, i, txtValue;
  input = $("#searchInput").val();
  filter = input.toUpperCase();
  divList = $(".cutList");
  li = $(".cutName");
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].innerText;
    // console.log(txtValue);
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      divList[i].style.display = "";
    } else {
      divList[i].style.display = "none";
    }
  }
}

function weight_button_click(){
  // console.log("Weight button");
  if($("#weightSelectButtonID").attr("data-toggle",)!="blank"){
    $("#measurementInputId").attr("placeholder", "Weight");
    $("#maxId").text("Max 5000");
  }
}

function thickness_button_click(){
  // console.log("Thickness button");
  $("#measurementInputId").attr("placeholder", "Thickness");
  $("#maxId").text("Max 100");
}

function configureInputField() {
  $("#resultId").hide();
  $.ajax({
    url: "../data.json",
    async: false,
    dataType: "json",
    success: function (response) {
      // do stuff with response.

      // Set doneness
      $("#measurementId").show();
      $("#weightSelectButtonID").attr("data-toggle", "pill");
      $("#weightSelectButtonTextID").css("text-decoration-line", "");

      $("#thicknessSelectButtonID").addClass("active");
      $("#measurementInputId").attr("placeholder", "Thickness");
      $("#maxId").text("Max 100");
      $("#weightSelectButtonID").removeClass("active");

      let index = sessionStorage.getItem("index");
      let cutCode = sessionStorage.getItem("cutCode");
      $("#selectDoneness").empty();
      if (!response[index].cuts[cutCode].weight) {
        for (let doneness in response[index].cuts[cutCode].size) {
          $("#selectDoneness").append(new Option(doneness, doneness));
        }
      }
      let donenessTmp;
      for (let doneness in response[index].cuts[cutCode].weight) {
        donenessTmp = doneness;
        $("#selectDoneness").append(new Option(doneness, doneness));
      }
      if (
        response[index].cuts[cutCode].weight[donenessTmp].values.length < 2 &&
        response[index].cuts[cutCode].size[donenessTmp].values.length < 2
      ) {
        $("#measurementId").hide();
      } else if (
        response[index].cuts[cutCode].weight[donenessTmp].values.length < 2
      ) {
        // console.log("Yes");
        $("#weightSelectButtonID").attr("data-toggle", "blank");
        $("#weightSelectButtonTextID").css(
          "text-decoration-line",
          "line-through"
        );
      }

      //end
    },
  });
}

function convertToGram(value) {
  if ($("#gSelectId").attr("aria-selected") == "true") {
    return value;
  }

  return parseInt(value * 28.35);
}

function convertToMM(value) {
  if ($("#mmSelectId").attr("aria-selected") == "true") {
    return value;
  }
  return parseInt(value * 25.4);
}

function calculate() {
  let doneness = $("#selectDoneness").find(":selected").text();
  let weightOrSize = "weight";
  let inputValue = 0;
  if ($("#thicknessSelectButtonID").attr("aria-selected") == "true") {
    weightOrSize = "size";
    inputValue = $("#measurementInputId").val();
    inputValue = parseInt(inputValue);
    inputValue = convertToGram(inputValue);
  } else {
    inputValue = $("#measurementInputId").val();
    inputValue = parseInt(inputValue);
    inputValue = convertToGram(inputValue);
  }

  $.ajax({
    url: "../data.json",
    async: false,
    dataType: "json",
    success: function (response) {
      // do stuff with response.
      let index = sessionStorage.getItem("index");
      let cutCode = sessionStorage.getItem("cutCode");
      if (weightOrSize == "weight") {
        if (response[index].cuts[cutCode].weight[doneness].values.length < 2) {
          set_result(
            response[index].cuts[cutCode].weight[doneness].values[0]
              .temperature,
            response[index].cuts[cutCode].weight[doneness].values[0].duration
          );
        } else {
          let flag = true;
          let max = 1000;
          for (let i in response[index].cuts[cutCode].weight[doneness].values) {
            /* console.log(inputValue);
            console.log(
              "Low " +
                response[index].cuts[cutCode].weight[doneness].values[i].low
            );
            console.log(
              "High " +
                response[index].cuts[cutCode].weight[doneness].values[i].high
            );
            console.log(
              response[index].cuts[cutCode].weight[doneness].values[i].low <=
                inputValue
            );
            console.log(
              response[index].cuts[cutCode].weight[doneness].values[i].high >=
                inputValue
            );*/

            if (
              response[index].cuts[cutCode].weight[doneness].values[i].low <=
                inputValue &&
              response[index].cuts[cutCode].weight[doneness].values[i].high >=
                inputValue
            ) {
              set_result(
                response[index].cuts[cutCode].weight[doneness].values[i]
                  .temperature,
                response[index].cuts[cutCode].weight[doneness].values[i]
                  .duration
              );
              flag = false;
              break;
            }
            max = response[index].cuts[cutCode].weight[doneness].values[i].high;
          }

          if (flag) {
            alert("Weight should be less then " + maxWeightLimit(max));
          }
        }
      } else {
        if (response[index].cuts[cutCode].size[doneness].values.length < 2) {
          set_result(
            response[index].cuts[cutCode].size[doneness].values[0].temperature,
            response[index].cuts[cutCode].size[doneness].values[0].duration
          );
        } else {
          let flag = true;
          let max = 1000;
          for (let i in response[index].cuts[cutCode].size[doneness].values) {
            if (
              response[index].cuts[cutCode].size[doneness].values[i].size >=
              inputValue
            ) {
              set_result(
                response[index].cuts[cutCode].size[doneness].values[i]
                  .temperature,
                response[index].cuts[cutCode].size[doneness].values[i].duration
              );
              flag = false;
              break;
            }
            max = response[index].cuts[cutCode].size[doneness].values[i].size;
          }
          if (flag) {
            alert("Size should be less then " + maxSizeLimit(max));
          }
        }
      }

      //end
    },
  });
}


function maxSizeLimit(max){
  // console.log("max size");
  // console.log($("#mmSelectId").attr("aria-selected"));
  if ($("#mmSelectId").attr("aria-selected") == "true") {
    return max+"mm";
  }
  let m = max*0.0393701;
  m = m.toFixed(2);
  return  m+"inch";
}


function maxWeightLimit(max){
  if ($("#gSelectId").attr("aria-selected") == "true") {
    return max+"g";
  }
  let m = max*0.035274;
  m = m.toFixed(2);
  return  m+"oz";
}

function set_result(temperature, duration) {
  $("#resultId").show();

  if ($("#cSelectId").attr("aria-selected") == "true") {
    $("#temperatureResult").text(temperature);
    $("#temperatureSymbolId").html("&#8451;");
  } else {
    let f = temperature * (9 / 5) + 32;
    f = f.toFixed(2);
    $("#temperatureResult").text(f);
    $("#temperatureSymbolId").html("&#8457;");
  }

  $("#durationResult").text(customTimeformat(duration));
}

function changeWeightUnit(unit){
  // console.log("Change wieght "+unit);
  if(unit=="g"){
    $("#gSelectId").addClass("active");
    $("#gSelectId").attr("aria-selected","true");
    $("#ozSelectId").removeClass("active");
    $("#ozSelectId").attr("aria-selected","false");
  }else{
    $("#gSelectId").removeClass("active");
    $("#gSelectId").attr("aria-selected","false");
    $("#ozSelectId").addClass("active");
    $("#ozSelectId").attr("aria-selected","true");
  }
}


function changeSizeUnit(unit){
  // console.log("Change Size "+unit);
  if(unit=="mm"){
    $("#mmSelectId").addClass("active");
    $("#mmSelectId").attr("aria-selected","true");
    $("#inSelectId").removeClass("active");
    $("#inSelectId").attr("aria-selected","false");
  }else{
    $("#mmSelectId").removeClass("active");
    $("#mmSelectId").attr("aria-selected","false");
    $("#inSelectId").addClass("active");
    $("#inSelectId").attr("aria-selected","true");
  }
}

function changeTemperatureUnit(unit){
  // console.log("Change Size "+unit);
  if(unit=="c"){
    $("#cSelectId").addClass("active");
    $("#cSelectId").attr("aria-selected","true");
    $("#fSelectId").removeClass("active");
    $("#fSelectId").attr("aria-selected","false");
  }else{
    $("#cSelectId").removeClass("active");
    $("#cSelectId").attr("aria-selected","false");
    $("#fSelectId").addClass("active");
    $("#fSelectId").attr("aria-selected","true");
  }
}

function customTimeformat(mm) {
  let hh = parseInt(mm / 60);

  mm = mm % 60;
  let timeStre = "";
  if (hh > 0) {
    if (hh == 1) {
      timeStr = hh + " hour ";
    } else {
      timeStr = hh + " hours ";
    }
  }
  if (mm > 0) {
    timeStr = timeStr + mm + " mins";
  }
  return timeStr;
}

$(".accordion__head .down-arrow").click(function () {
  $(".accordion").toggleClass("accordion--expanded");
  $(".accordion__content").slideToggle(280);
});


