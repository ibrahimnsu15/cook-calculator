console.log("Test json");
var data;
$.getJSON("../data.json", function (info) {
  //   console.log(data[0]["names"]["en"]); // this will show the info it in firebug console
  data = info;
});

function animal_select(index, animalNameEn, animalNameDe) {
  sessionStorage.setItem("index", index);
  sessionStorage.setItem("animalNameEn", animalNameEn);
  sessionStorage.setItem("animalNameDe", animalNameDe);
}

function cut_select(cutCode, cutName) {
  sessionStorage.setItem("cutCode", cutCode);
  sessionStorage.setItem("cutName", cutName);
}

if (window.location.pathname == "/calculator/cut.html") {
  if (!sessionStorage.getItem("index")) {
    window.location.replace("/calculator/animal.html");
  } else {
    $("#animalNameEn").text(sessionStorage.getItem("animalNameEn"));
    show_cut_list();
  }
} else if (window.location.pathname == "/calculator/parameter.html") {
  if (!sessionStorage.getItem("index") || !sessionStorage.getItem("cutCode")) {
    window.location.replace("/calculator/animal.html");
  } else {
    $("#animalName").text(sessionStorage.getItem("animalNameEn"));
    $("#cutName").text(sessionStorage.getItem("cutName"));
    configureInputField();
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
      for (let cutCode in response[index].cuts) {
        for (let i in response[index].cuts[cutCode].name.en) {
          let cutName = response[index].cuts[cutCode].name.en[i];
          //   let cutName = response[index]["cuts"][cutCode]["name"]["en"][j];
          cutItem =
            '<div class="row cutList" style="padding: 10px; padding-top: 9px"><div class="detail-grid-option"><a href="parameter.html" onclick="cut_select(\'' +
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
  console.log(filter);
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

function configureInputField() {
  $("#resultId").hide();
  $.ajax({
    url: "../data.json",
    async: false,
    dataType: "json",
    success: function (response) {
      // do stuff with response.

      // Set doneness

      let index = sessionStorage.getItem("index");
      let cutCode = sessionStorage.getItem("cutCode");

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
      console.log(
        response[index].cuts[cutCode].weight[donenessTmp].values.length
      );
      console.log(
        response[index].cuts[cutCode].size[donenessTmp].values.length
      );
      if (
        response[index].cuts[cutCode].weight[donenessTmp].values.length < 2 &&
        response[index].cuts[cutCode].size[donenessTmp].values.length < 2
      ) {
        $("#measurementId").hide();
      } else if (
        response[index].cuts[cutCode].weight[donenessTmp].values.length < 2
      ) {
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
    inputValue = $("#thicknessInputId").val();
    inputValue = parseInt(inputValue);
    inputValue = convertToGram(inputValue);
  } else {
    inputValue = $("#weightInputId").val();
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
            console.log(inputValue);
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
            );

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
            alert("Weight should be less then " + max + "g");
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
            alert("Size should be less then " + max + "mm");
          }
        }
      }

      //end
    },
  });
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

function customTimeformat(mm) {
  let hh = parseInt(mm / 60);

  mm = mm % 60;
  let timeStr = "";
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
