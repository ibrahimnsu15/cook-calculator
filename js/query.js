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
            '<div class="row" style="padding: 10px; padding-top: 9px"><div class="detail-grid-option"><a href="parameter.html" onclick="cut_select(\'' +
            cutCode +
            "','" +
            cutName +
            "')\"><h4>" +
            cutName +
            "</h4></a></div></div>";
          $("#cutList").append(cutItem);
        }
      }
    },
  });
}

function configureInputField() {
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

      if (
        response[index].cuts[cutCode].weight[donenessTmp].values.length < 2 &&
        response[index].cuts[cutCode].size[donenessTmp].values.length < 2
      ) {
        $("#measurementId").hide();
      }

      //end
    },
  });
}
