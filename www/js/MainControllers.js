angular
  .module('starter.controllers', [])
  .controller('DashCtrl', DashCtrl)
  .controller('ChatsCtrl', ChatsCtrl)
  .controller('ChatDetailCtrl', ChatDetailCtrl)
  .controller('AccountCtrl', AccountCtrl)

  function DashCtrl($scope, $rootScope, $location, $window, $ionicLoading, $ionicModal, $ionicPopup, $localStorage, $ionicViewSwitcher, $state, $cordovaBarcodeScanner, $ionicPlatform) {

    if($localStorage.checkin != null) {
      $scope.username = $localStorage.checkin.data[0].name;
    }

    $ionicPlatform.ready(function() {

      $scope.scanBarcode = function() {

        $cordovaBarcodeScanner.scan().then(function(imageData) {

            $ionicLoading.show({ template: "<p>Checking ..</p><ion-spinner></ion-spinner>", duration: 1000 });
            $state.go('tab.barcodeDetail');
            $scope.obj = imageData.text;        

        }, function(error) {

            console.log(error);

        });

      }

      $scope.goToSetting = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('tab.account');
      }

      $scope.goToCheckin = function() {

        $scope.data = {};
        var getCredentials = $ionicPopup.show({
            title: 'CheckIn',
            subTitle: 'Checkin agar anda bisa menerima pelanggan terdaftar',
            template: '<div class="row"><div class="col col-100"><input type="email" ng-model="data.email" placeholder="Email .." style="border: 2px solid #3498db;padding:20px;text-align:center;font-size:12px;color:#3498db;" required><input type="password" ng-model="data.password" placeholder="Password .." style="border: 2px solid #3498db;padding:20px;text-align:center;font-size:12px;color:#3498db;margin-top:2px;" required></div></div> ',
            scope: $scope,
            buttons: [{
              text: 'Kembali',
              type: 'button-stable'
            }, {
              text: 'CheckIn',
              type: 'button-stable',
            onTap: function(e) {
              if (!$scope.data.email && !$scope.data.password) {

                e.preventDefault();

              } else {

                $ionicLoading.show({ template: "<p>Logging in ..</p><ion-spinner></ion-spinner>", duration: 3000 });
                $localStorage.checkin = 
                 {
                   data : 
                   [
                     {
                       'name' : 'Faisal A', 
                       'email' : $scope.data.email,
                       'privilege' : 'jukir',
                       'tglmasuk' : new Date()
                      }
                   ] 
                 };
                 $state.go($state.current, {}, {reload: true});

              }
            }
          }]
        });

      }

      $scope.goToCheckout = function() {

        var alertPopup = $ionicPopup.confirm({
            title: 'CheckOut',
            template: $localStorage.checkin.data[0].name + ', apakah anda yakin \n ingin checkout ?',
            okType: "button-stable",
            okText: 'CheckOut',
            cancelText: 'Kembali'         
        });        

        alertPopup.then(function(res) {
            if (res) {
              $ionicLoading.show({ template: "<p>Logging Out ..</p><ion-spinner></ion-spinner>", duration: 3000 });
              delete $localStorage.checkin;
              $state.go($state.current, {}, {reload: true});
            }
        });
        
      }

    }, false);

  }

  function ChatsCtrl($scope, Chats) {

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    };

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  }

  function ChatDetailCtrl($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  }

  function AccountCtrl($scope) {
    $scope.settings = {
      enableFriends: true
    };
  }
