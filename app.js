var app = angular.module('project', []);

var imagearray = [{
    link: 'Order',
    text: 'Order OTC medications',
    name: 'http://www.mobyrxme.com/userfiles/images/over_the_counter.gif'
  }, {
    link: 'Talk',
    text: 'ask questions to your pharmacist',
    name: 'http://img.ehowcdn.com/article-new-thumbnail/ehow/images/a04/8n/g8/choose-over-counter-pain-medicine-800x800.jpg'
  }, {
    link: 'Pay',
    text: 'Pay effortlessly',
    name: 'http://www.jajajaparty.com/wp-content/uploads/2011/10/paypal_logo.jpg'
  }, {
    link: 'Drop Off',
    text: 'Wait for delivery',
    name: 'http://www.xyzinsurance.co.uk/blog/wp-content/uploads/2011/10/bike-courier.jpg'
  }, {
    link: 'Feedback',
    text: 'Feedback matters',
    name: 'http://4.bp.blogspot.com/-ni91ZzA2Bf8/T-tnOcX55nI/AAAAAAAAAIY/uA1VK9lZ3MA/s1600/Feedback.png'
  }

];

var meds = ['Listerine', 'Tums', 'Visine', 'cold med', 'vicks', 'viagra', 'tylenol', 'Oragel', 'Zycam', 'Advil', 'Selsun blue'];

app.controller('appCtrl', function($scope) {

  $scope.dosage = [{
    value: '1',
    displayName: '1 per day'
  }, {
    value: '2',
    displayName: 'twice a day'
  }];
  $scope.qty = [{
    value: '1'
  }, {
    value: '2'
  }];

});
app.directive('infoBox', function($compile) {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    templateUrl: "info-box.html",
    link: function(scope, element, attrs) {

      // ? i'm completely lost here

    }
  };
});

app.config(['$httpProvider',
  function($httpProvider, res) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }
]);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: 'list.html'
    }).
  when('/map', {
    controller: 'MapCtrl',
    templateUrl: 'map.html'
  }).
  when('/flow', {
    controller: 'FlowCtrl',
    templateUrl: 'flow.html'
  }).
  when('/meds', {
    controller: 'CreateCtrl',
    templateUrl: 'detail.html'
  }).

  when('/deliver', {
    controller: 'DeliverCtrl',
    templateUrl: 'deliver.html'

  })
    .otherwise({
      redirectTo: '/'

    });

}).
controller('FlowCtrl', function($scope) {
  $scope.pics = imagearray;
})
  .controller('ListCtrl', function($scope, $http) {
    $scope.message = 'Get medicine delivery in the comfort of your house.This is welcome screen . Get Rx is financed by advertising, third-party contributions and sponsorships.GetRx also offers services to physicians and private clients.';

  })
  .controller('CreateCtrl', function($scope, $http, $location) {
    $scope.cart = [];
    $scope.list = function(name) {
      //var url = "https://query.yahooapis.com/v1/public/yql?q=select%20title%20from%20rss%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&format=json&diagnostics=true";
      //$http.get(url).success(function(data) {
      //$scope.names = data.query.results.item;
      this.names = meds;
      //});
    };
    $scope.list();

    $scope.removeMeds = function(medsIndex) {
      if (medsIndex >= 0 && medsIndex < $scope.cart.length) {
        $scope.cart.splice(medsIndex, 1);
      }
    };
    $scope.found = function(name) {
      $scope.namesel = name;
    };
    $scope.add = function(namesel, qty, dosage) {
      //$scope.order = "Added " + namesel;

      $scope.cart.push({
        medicine: namesel,
        qty: qty,
        dosage: dosage
      });

    };


  }).
directive('address', function() {
  return {
    restrict: 'E',
    templateUrl: 'address.html'

  };
}).
directive('payment', function() {
  return {
    restrict: 'E',
    templateUrl: 'payment.html'

  };
}).
directive('medicine', function() {
  return {
    restrict: 'E',
    templateUrl: 'searchmeds.html'
  };
}).
controller('AddCtrl', function($scope) {
  $scope.message = 'This is edit cart screen that confirm meds added, edit dosage and set qty.';
  $scope.cart = $scope.mycart;

}).
controller('DeliverCtrl', function($scope) {

  $scope.save = function($project) {
    $scope.list = [];
    $scope.list.push({
      "name": $project.name,
      "email": $project.site,
      "description": $project.description,
      "num": $project.num
    });

  };
}).
controller('MapCtrl', function($scope, $compile, $http) {
  // google.maps.event.addListener(window, 'click', initialize);

$scope.choose = function(title){
$scope.pharmaddr = [];
$scope.pharmaddr.push(
  {
    "addr":title
    
  }
  )
};
  // function initialize() {
  $scope.findit = function(zip) {
    $scope.mylocation = $scope.zip;



    $scope.zip = $scope.mylocation;
    var url = "https://maps.googleapis.com/maps/api/geocode/json?libraries=geometry&sensor=true";
    $http.get(url, {
      params: {
        address: $scope.zip
      }
    }).success(function(data) {
      $scope.addr = data.results[0].formatted_address;
      $scope.findpharm = data.results[0].geometry.location.lat;
      $scope.findpharm1 = data.results[0].geometry.location.lng;



      $scope.locations = [{
        id: 08,
        name: 'home',
        address: $scope.addr,
        latitude: $scope.findpharm,
        longitude: $scope.findpharm1
      }];

      $scope.latlng = new google.maps.LatLng($scope.locations[0].latitude, $scope.locations[0].longitude);


      $scope.map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: 11,
        center: $scope.latlng,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
      });

      $scope.marker = new google.maps.Marker({
        position: $scope.latlng,
        map: $scope.map,
        visible: true,
        animation: google.maps.Animation.DROP,
        locationData: $scope.locations[0]
      });


    }).error(function(status) {
      console.log("cannot find location..please try again later");
    });



    var boxText = document.createElement("div");
    boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
    boxText.innerHTML = "CVS pharmacy , Livonia MI";


    // rather create this inside the info-box directive?
    $scope.infoBox = new InfoBox({
      content: boxText,
      disableAutoPan: false,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(-140, 0),
      zIndex: null,
      boxStyle: {
        background: "url('tipbox.gif') no-repeat",
        opacity: 0.75,
        width: "280px"
      },
      closeBoxMargin: "10px 2px 2px 2px",
      closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
      infoBoxClearance: new google.maps.Size(1, 1),
      isHidden: false,
      pane: "floatPane",
      enableEventPropagation: false
    });


    //list the addresses near Zip code
    var ziplist = $scope.zip;
    var wsql = 'select * from local.search where query="CVS" and location = "' + ziplist + '"';

    var urlzip = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(wsql) + '&format=json&diagnostics=true';
    $http.get(urlzip).success(function(data) {

      // $scope.url = data.query.results.Question[0].UserPhotoURL;
      var row0 = data.query.results.Result[0];
      var row1 = data.query.results.Result[1];
      var row2 = data.query.results.Result[2];
      var row3 = data.query.results.Result[3];
      var row4 = data.query.results.Result[4];
      var shop0 = row0.Title;
      var shop1 = row1.Title;
      var shop2 = row2.Title;
      var shop3 = row3.Title;
      var shop4 = row4.Title;
      var url0 = row0.City;
      var url1 = row1.City;
      var url2 = row2.City;
      var url3 = row3.City;
      var url4 = row4.City;
      var ph0 = row0.Phone;
      var ph1 = row1.Phone;
      var ph2 = row2.Phone;
      var ph3 = row3.Phone;
      var ph4 = row4.Phone;
      $scope.result = "1." + shop0 + "." + row0.Address + " , " + url0 + " -->PH " + ph0;
      $scope.result1 = "2." + shop0 + "." + row1.Address + " , " + url1 + " -->PH " + ph1;
      $scope.result2 = "3." + shop0 + "." + row2.Address + " , " + url2 + " -->PH " + ph2;
      $scope.result3 = "4." + shop0 + "." + row3.Address + " , " + url3 + " -->PH " + ph3;
      $scope.result4 = "5." + shop0 + "." + row4.Address + " , " + url4 + " -->PH " + ph4;

      $scope.title0 = row0.Distance;
      $scope.title1 = row1.Distance;
      $scope.title2 = row2.Distance;
      $scope.title3 = row3.Distance;
      $scope.title4 = row4.Distance;
    });

    // google.maps.event.addListener($scope.marker, 'click', function(e) {
    //     $scope.infoBox.open($scope.map, this);
    //  });

    $scope.infoBox.open($scope.map, $scope.marker);

  };

  $scope.list = function(res) {

  };



});
