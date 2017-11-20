angular.module('starter.controllers', [])

//*************************************** Login Controller (Start) ************************************//
.controller('LoginCtrl', function($rootScope, $scope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
      checkLogin();
      $ionicHistory.clearCache();
  });

  $scope.submitLogin = function(item){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    if(item.usrMobileNo == "" || item.usrMobileNo == null){
      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Please Enter Mobile Number',
        duration: 2000
      });
      return;
    }else if(item.usrPassword == "" || item.usrPassword == null){
      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Please Enter Password',
        duration: 2000
      });
      return;
    }else if(item.usrMobileNo.length <= 9){

      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Mobile Number must be 10 digits',
        duration: 2000
      });
      return;

    }else{

      var data = $.param({
        usrMobileNo: item.usrMobileNo,
        usrPassword: item.usrPassword
      });

      $http.get(main_url+'Api/user_login?'+data)
      .then(function(response){

        if(response.data.status == "success"){

          $scope.loader = false;

          $localStorage.login = response.data.status;
          $localStorage.currentUserId = response.data.usrId;
          $localStorage.currentUserTokenId = response.data.usrTokenId;
          $localStorage.currentUserName = response.data.usrUserName;
          $localStorage.currentUserMobileNo = response.data.usrMobileNo;

          $ionicLoading.hide();

          $state.go('tab.dash');

        }else{

          $scope.loader = false;

          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
              template: '<p align="center">'+response.data.message+'</p>'
          });

        }


      },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

    }

  }
  
  $scope.goToSignup = function(){
    $state.go('signup');
  }

  $scope.goToForgetPassword = function(){
    $state.go('forgetpassword');
  }

  function checkLogin(){
    if($localStorage.login){
      $state.go('tab.dash');
    }else{
      $ionicHistory.clearHistory();
      $scope.login = { 
        usrMobileNo: '', 
        usrPassword: ''
      };
    }
  }
})
//*************************************** Login Controller (End) ************************************//

//*************************************** Signup Controller (Start) ************************************//
.controller('SignupCtrl', function($rootScope, $scope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
      checkLogin();
  });

  var getMobileNo = "";
  var getOTP = "";

  $scope.submitSignupMobile = function(item){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    if(item.usrMobileNo.length <= 9){

      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Mobile Number must be 10 digits',
        duration: 2000
      });

    }else{

      var data = $.param({
        usrMobileNo: item.usrMobileNo
      });

      $http.get(main_url+'Api/add_user_mobile?'+data)
      .then(function(response){

        if(response.data.status == "success"){

          $ionicLoading.hide();

/*
          var alertPopup = $ionicPopup.alert({
              title: 'Success!',
              template: '<p align="center">'+response.data.message+'</p>'
          });*/

          getMobileNo = response.data.usrMobileNo;
          getOTP = response.data.usrOTP;

          $rootScope.currentRegMobileNo = response.data.usrMobileNo;

        }else{

          $ionicLoading.hide();

          var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
              template: '<p align="center">'+response.data.message+'</p>'
          });

        }


      },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

    }

  }

  $scope.sendOTPAgain = function(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    if(getMobileNo == ""){
      $ionicLoading.hide();

      $ionicLoading.show({
        template: 'OTP not available',
        duration: 2000
      });

    }else{

      var data = $.param({
        usrMobileNo: getMobileNo
      });

      $http.get(main_url+'Api/send_otp_again?'+data)
      .then(function(response){

        if(response.data.status == "success"){

          $ionicLoading.hide();
          /*
          var alertPopup = $ionicPopup.alert({
              title: 'Success!',
              template: '<p align="center">'+response.data.message+'</p>'
          });*/

        }else{
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
              template: '<p align="center">'+response.data.message+'</p>'
          });

        }

      },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });
      
    }
  }

  $scope.submitOTPVerification = function(item){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    if(item.usrOTP.length <= 3 || item.usrOTP == ""){
      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Please Enter Valid OTP',
        duration: 2000
      });

    }else{

      var data = $.param({
        usrMobileNo: getMobileNo,
        usrOTP: item.usrOTP
      });

      $http.get(main_url+'Api/user_otp_verification?'+data)
      .then(function(response){

        if(response.data.status == "success"){
          $ionicLoading.hide();

          $state.go('signuptwo');

        }else{
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
              template: '<p align="center">'+response.data.message+'</p>'
          });
        }


      },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

    }



  }

  $scope.goToSignup2 = function(){
    $state.go('signuptwo');
  }

  function checkLogin(){
    if($localStorage.login){
      $state.go('tab.dash');
    }else{
      $scope.signup = { 
        usrMobileNo: '', 
        usrOTP: ''
      };
    }
  }
})
//*************************************** Signup Controller (End) ************************************//

//*************************************** Signup Two Controller (Start) ************************************//
.controller('SignuptwoCtrl', function($rootScope, $scope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.submitSignuptwo = function(item){
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    if(item.usrPassword == item.usrPasswordC){

      if($rootScope.currentRegMobileNo == null || $rootScope.currentRegMobileNo == ""){
        $ionicLoading.hide();

        $ionicLoading.show({
          template: 'Problem in registration, Please try again from start',
          duration: 2000
        });

      }else{

        var data = $.param({
          usrMobileNo: $rootScope.currentRegMobileNo,
          usrUserName: item.usrUserName,
          usrPassword: item.usrPassword
        });

        $http.get(main_url+'Api/update_user_registration?'+data)
        .then(function(response){

          if(response.data.status == "success"){


            var data = $.param({
              usrMobileNo: $rootScope.currentRegMobileNo,
              usrPassword: item.usrPassword
            });

            $http.get(main_url+'Api/user_login?'+data)
            .then(function(response){

              if(response.data.status == "success"){

                $ionicLoading.hide();

                $localStorage.login = response.data.status;
                $localStorage.currentUserId = response.data.usrId;
                $localStorage.currentUserTokenId = response.data.usrTokenId;
                $localStorage.currentUserName = response.data.usrUserName;
                $localStorage.currentUserMobileNo = response.data.usrMobileNo;

                $state.go('tab.dash');

              }else{

                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                    title: 'Warning!',
                    template: '<p align="center">'+response.data.message+'</p>'
                });

              }


            });


          }else{

            $ionicLoading.hide();

            var alertPopup = $ionicPopup.alert({
                title: 'Warning!',
                template: '<p align="center">'+response.data.message+'</p>'
            });

          }

        },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

      }

    }else{

      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Password does not Match',
        duration: 2000
      });
    }

  }



  $scope.goToDashboard = function(){
    $state.go('tab.dash');
  }

  function checkLogin(){
    if($localStorage.login){
      $state.go('tab.dash');
    }else{
      $scope.signuptwo = { 
        usrUserName: '', 
        usrPassword: '',
        usrPasswordC: ''
      };
    }
  }
})
//*************************************** Signup Two Controller (End) ************************************//

.controller('DashCtrl', function($rootScope, $scope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.goToTabCategories = function(item){
    //$state.go('tab.categories');
    $localStorage.currentMcatId = item.mcatId;

    window.location = "#/tab/categories/"+item.mcatId
  }

  function getMainCategories(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_main_categories?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.mcats = response.data.data;

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      $ionicHistory.clearHistory();
      $rootScope.changeCartNumber();
      getMainCategories();
    }
  }

})

.controller('CatCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  function getCategories(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      mcatId: $localStorage.currentMcatId
    });

    $http.get(main_url+'Api/get_categories?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.cats = response.data.data;

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }



  $scope.backToHome = function(){
    $state.go('tab.dash');
  }
  $scope.goToTabItemList = function(item){
    //$state.go('tab.itemlist');
    $localStorage.currentCatId = item.catId;
    $localStorage.currentCatName = item.catName;
    window.location = "#/tab/itemlist/"+item.catId
  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      getCategories();
    }
  }

})

.controller('ItemlistCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.itemCatName = $localStorage.currentCatName;

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.type = {itemType: false};
  $scope.notavailable = false;
  
  function getItems(typeId){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      catId: $localStorage.currentCatId,
      typeId: typeId
    });


    $http.get(main_url+'Api/get_items?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();
        $scope.notavailable = false;

        $scope.items = response.data.data;

      }else{
        $ionicLoading.hide();
        /*
        var alertPopup = $ionicPopup.alert({
            title: 'Sorry',
            template: '<p align="center">'+response.data.message+'</p>'
        });*/

        $scope.notavailable = true;
        $scope.notMessage = response.data.message;

        $scope.items = '';

        
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  $scope.itemTypeChange = function(item){
    if(item.itemType == true){
      getItems(2);
    }else{
      getItems(1);
    }
  }

  $scope.backToCategories = function(){
    //$state.go('tab.categories');
    window.location = "#/tab/categories/"+$localStorage.currentMcatId
  }
  $scope.goToTabItemDetails = function(item){
    //$state.go('tab.itemdetails');
    $localStorage.currentItmId = item.itmId;
    window.location = "#/tab/itemdetails/"+$localStorage.currentItmId
  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      if($scope.type.itemType == true){
        getItems(2);
      }else{
        getItems(1);
      }
      
    }
  }
})

.controller('ItemdetailsCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.currentItemQuantity = 1;

  function getItemDetails(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      itmId: $localStorage.currentItmId
    });

    $http.get(main_url+'Api/get_item_details?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.itmId = response.data.itmId;
        $scope.itmName = response.data.itmName;
        $scope.itmPrice = response.data.itmPrice;
        $scope.itmDescription = response.data.itmDescription;
        $scope.itmImage = response.data.itmImage;
        $scope.quantityPrice = $scope.itmPrice;

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  $scope.quantityIncrease = function(){
    $scope.currentItemQuantity = $scope.currentItemQuantity+1;
    $scope.quantityPrice = $scope.quantityPrice*1 + $scope.itmPrice*1;
  }

  $scope.quantityDecrease = function(){
    if($scope.currentItemQuantity > 1){
      $scope.currentItemQuantity = $scope.currentItemQuantity-1;
      $scope.quantityPrice = $scope.quantityPrice*1 - $scope.itmPrice*1;
    }
    
  }

  $scope.addToCart = function(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      crtItmId: $scope.itmId,
      crtQuantity: $scope.currentItemQuantity,
      crtAmount: $scope.quantityPrice
    });

    $http.get(main_url+'Api/add_to_cart?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $rootScope.changeCartNumber();

        window.location = "#/tab/itemlist/"+$localStorage.currentCatId




      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  $scope.backToItemList = function(){
    //$state.go('tab.itemlist');
    window.location = "#/tab/itemlist/"+$localStorage.currentCatId
  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      getItemDetails();
    }
  }

})

.controller('CartsCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, $ionicModal) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.refreshCart = function(){
    checkLogin();
  }

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.goToCheckout = function(){
    if($scope.totalAmount <= 99){
      var alertPopup = $ionicPopup.alert({
          title: 'Warning!',
          template: '<p align="center">Minimum Order Amount must be more than 99 Rupees</p>'
      });

    }else{


      if($scope.couponDiscount == 0){
        $localStorage.currentCheckoutTotalAmount = $scope.totalAmount;
        $localStorage.currentCheckoutSubTotalAmount = $scope.subTotal;
        $localStorage.currentCheckoutTax1Amount = $scope.serviceTax;
        $localStorage.currentCheckoutTax1Rate = $scope.serviceTaxRate;
        $localStorage.currentCheckoutTax2Amount = $scope.vat;
        $localStorage.currentCheckoutTax2Rate = $scope.vatRate;
        $localStorage.currentDiscountAmount = $scope.couponDiscount;
        $localStorage.currentCouponStatus = 'false';
        $localStorage.currentCouponId = $scope.couponId;
        $localStorage.currentCouponCode = $scope.couponCode;
        $state.go('tab.checkout');
      }else{
        $localStorage.currentCheckoutTotalAmount = $scope.totalAmount;
        $localStorage.currentCheckoutSubTotalAmount = $scope.subTotal;
        $localStorage.currentCheckoutTax1Amount = $scope.serviceTax;
        $localStorage.currentCheckoutTax1Rate = $scope.serviceTaxRate;
        $localStorage.currentCheckoutTax2Amount = $scope.vat;
        $localStorage.currentCheckoutTax2Rate = $scope.vatRate;
        $localStorage.currentDiscountAmount = $scope.couponDiscount;
        $localStorage.currentCouponStatus = 'true';
        $localStorage.currentCouponId = $scope.couponId;
        $localStorage.currentCouponCode = $scope.couponCode;
        $state.go('tab.checkout');
      }
      
    }
    
  }

  $rootScope.changeCarts = function(){
    changeGetCarts();
  }

  $scope.deleteCart = function(item){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      crtId: item.crtId
    });


    $http.get(main_url+'Api/delete_from_cart?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $rootScope.changeCartNumber();

        getCarts();

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });



  }


  $scope.checkCoupon = function(item){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_carts?'+data)
    .then(function(response){

      if(response.data.status == "success"){

        $scope.emptycart = false;
        $scope.notemptycart = true;

        $scope.carts = response.data.data;
        $scope.subTotal = 0;
        $scope.serviceTaxRate = response.data.service_tax_rate;
        $scope.vatRate = response.data.vat_rate;

        for(var i=0; i<$scope.carts.length; i++){
          $scope.subTotal = $scope.subTotal + parseInt($scope.carts[i].crtAmount);
        }

        $scope.serviceTax = Math.round(parseFloat(parseFloat($scope.subTotal)*(parseFloat($scope.serviceTaxRate)/100)));
        $scope.vat = Math.round(parseFloat(parseFloat($scope.subTotal)*(parseFloat($scope.vatRate)/100)));
        $scope.totalAmount = Math.round(parseFloat(parseFloat($scope.subTotal)+parseFloat($scope.serviceTax)+parseFloat($scope.vat)));

        var data = $.param({
          usrId: $localStorage.currentUserId,
          usrTokenId: $localStorage.currentUserTokenId,
          cpnCode: item.cpnCode,
          totalAmount: $scope.totalAmount
        });


        $http.get(main_url+'Api/coupon_validation?'+data)
        .then(function(response){

          if(response.data.status == "success"){
            $ionicLoading.hide();
            $scope.couponMessageDisplay = false;

            if(response.data.cpnDiscountType == 'Percentage'){

              var percentDiscount = parseFloat(response.data.cpnDiscount);
              $scope.couponDiscount = parseInt((parseFloat(percentDiscount)*parseFloat($scope.totalAmount))/100);
              $scope.totalAmount = $scope.totalAmount-$scope.couponDiscount;
              $scope.couponId = response.data.cpnId;
              $scope.couponCode = response.data.cpnCode;

            }else{

              $scope.couponDiscount = parseInt(response.data.cpnDiscount);
              $scope.totalAmount = $scope.totalAmount-$scope.couponDiscount;
              $scope.couponId = response.data.cpnId;
              $scope.couponCode = response.data.cpnCode;

            }

          }else{
            $ionicLoading.hide();
            /*
            var alertPopup = $ionicPopup.alert({
                title: 'Warning!',
                template: '<p align="center">'+response.data.message+'</p>'
            });*/
            $scope.couponDiscount = 0;
            $scope.couponId = 0;
            $scope.couponCode = 0;
            $scope.couponMessageDisplay = true;
            $scope.couponMessage = response.data.message;
            getCarts();
          }


        });

      }else{
        $ionicLoading.hide();

        $scope.carts = ''
        $scope.subTotal = 0;
        $scope.serviceTaxRate = 'NA';
        $scope.vatRate = 'NA';
        $scope.serviceTax = 0;
        $scope.vat = 0;
        $scope.totalAmount = 0;

        $scope.emptycart = true;
        $scope.notemptycart = false;

      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });


  }


  function getCarts(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_carts?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.emptycart = false;
        $scope.notemptycart = true;

        $scope.carts = response.data.data;
        $scope.subTotal = 0;
        $scope.serviceTaxRate = response.data.service_tax_rate;
        $scope.vatRate = response.data.vat_rate;

        for(var i=0; i<$scope.carts.length; i++){
          $scope.subTotal = $scope.subTotal + parseInt($scope.carts[i].crtAmount);
        }

        $scope.serviceTax = Math.round(parseFloat(parseFloat($scope.subTotal)*(parseFloat($scope.serviceTaxRate)/100)));
        $scope.vat = Math.round(parseFloat(parseFloat($scope.subTotal)*(parseFloat($scope.vatRate)/100)));
        $scope.totalAmount = Math.round(parseFloat(parseFloat($scope.subTotal)+parseFloat($scope.serviceTax)+parseFloat($scope.vat)));

      }else{
        $ionicLoading.hide();

        $scope.carts = ''
        $scope.subTotal = 0;
        $scope.serviceTaxRate = 'NA';
        $scope.vatRate = 'NA';
        $scope.serviceTax = 0;
        $scope.vat = 0;
        $scope.totalAmount = 0;

        $scope.emptycart = true;
        $scope.notemptycart = false;

      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function changeGetCarts(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_carts?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.carts = response.data.data;
        $scope.subTotal = 0;
        $scope.serviceTaxRate = response.data.service_tax_rate;
        $scope.vatRate = response.data.vat_rate;

        for(var i=0; i<$scope.carts.length; i++){
          $scope.subTotal = $scope.subTotal + parseInt($scope.carts[i].crtAmount);
        }

        $scope.serviceTax = parseInt(parseInt($scope.subTotal)*(parseFloat($scope.serviceTaxRate)/100));
        $scope.vat = parseInt(parseInt($scope.subTotal)*(parseFloat($scope.vatRate)/100));
        $scope.totalAmount = parseInt(parseInt($scope.subTotal)+parseInt($scope.serviceTax)+parseInt($scope.vat));

      }else{
        $ionicLoading.hide();

        $scope.carts = ''
        $scope.subTotal = 0;
        $scope.serviceTaxRate = 'NA';
        $scope.vatRate = 'NA';
        $scope.serviceTax = 0;
        $scope.vat = 0;
        $scope.totalAmount = 0;

      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }


$ionicModal.fromTemplateUrl('templates/modal-cart.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showModal = function(item){

    $scope.cartCurrentItemImage = item.crtItmImage;
    $scope.cartCurrentItemName = item.crtItmName;
    $scope.cartCurrentItemQuantity = item.crtQuantity;
    $scope.cartCurrentAmount = item.crtAmount;
    $scope.cartCurrentItemPrice = item.crtItmPrice;
    $scope.cartCurrentId = item.crtId;

    $scope.modal.show();

  }


  $scope.quantityIncrease = function(){
    $scope.cartCurrentItemQuantity = parseInt($scope.cartCurrentItemQuantity)+1;
    $scope.cartCurrentAmount = $scope.cartCurrentAmount*1 + $scope.cartCurrentItemPrice*1;
  }

  $scope.quantityDecrease = function(){
    if($scope.cartCurrentItemQuantity > 1){
      $scope.cartCurrentItemQuantity = parseInt($scope.cartCurrentItemQuantity)-1;
      $scope.cartCurrentAmount = $scope.cartCurrentAmount*1 - $scope.cartCurrentItemPrice*1;
    }
    
  }

  $scope.updateCart = function(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      crtId: $scope.cartCurrentId,
      crtQuantity: $scope.cartCurrentItemQuantity,
      crtAmount: $scope.cartCurrentAmount
    });


    $http.get(main_url+'Api/update_cart?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.modal.hide();
        $scope.cpn = { 
          cpnCode: ''
        };
        $scope.couponMessageDisplay = false;
        $scope.couponDiscount = 0;
        getCarts();


      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }




  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      getCarts();
      $scope.cpn = { 
        cpnCode: ''
      };
      $scope.couponDiscount = 0;
      $scope.couponId = 0;
      $scope.couponCode = 0;
      $scope.couponMessageDisplay = false;
    }
  }

})

.controller('CheckoutCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {
  

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });
  
  $rootScope.changeCheckoutAccountAddress = function(){
    $scope.checkoutAccountAddress = $localStorage.userProfileAddress;
  }


  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  

  $scope.changeCheckoutCod = function(item){

    if(item.cod == false){
      $scope.checkcod = {cod: true};
    }

  }

  $scope.changeCheckoutAccountAddress = function(item){

    if(item.accountAddress == true){
      $scope.checknewaddress = {newAddress: false};
    }else{
      $scope.checknewaddress = {newAddress: true};
    }

  }

  $scope.changeCheckoutNewAddress = function(item){

    if(item.newAddress == true){
      $scope.checkaccountaddress = {accountAddress: false};
    }else{
      $scope.checkaccountaddress = {accountAddress: true};
    }

  }

  $scope.changeCheckoutPaytm = function(item){

    if(item.paytm == true){

      var alertPopup = $ionicPopup.alert({
          title: 'Sorry',
          template: '<p align="center"> PAYTM service not available now</p>'
      });

      $scope.checkpaytm = {paytm: false};

    }

  }

  $scope.backToCarts = function(){
    $state.go('tab.carts');
  }

  $scope.goToThankyou = function(){
    $state.go('tab.thankyou');
  }

  $scope.addOrder = function(item){

    if($scope.checknewaddress.newAddress == true){
      
      if(item.checkoutNewAddress == "" || item.checkoutNewAddress == null){
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center"> Please Enter Valid Address</p>'
        });
      }else{
        $scope.ordAddress = item.checkoutNewAddress;
        addMyCODOrder($scope.ordAddress);
      }
    }else{
      $scope.ordAddress = $scope.checkoutAccountAddress;
      if($scope.ordAddress == "" || $scope.ordAddress == null){
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center"> Please Add Valid Address</p>'
        });
      }else{
        addMyCODOrder($scope.ordAddress);
      }
      
    }

  }

  function addMyCODOrder(ordAddress){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      ordTotalAmount: $scope.checkoutTotalAmount,
      ordSubTotalAmount: $scope.checkoutSubTotalAmount,
      ordTax1Amount: $scope.checkoutTax1Amount,
      ordTax1Rate: $scope.checkoutTax1Rate,
      ordTax2Amount: $scope.checkoutTax2Amount,
      ordTax2Rate: $scope.checkoutTax2Rate,
      ordDiscountAmount: $scope.checkoutDiscountAmount,
      ordCouponStatus: $scope.checkoutCouponStatus,
      ordCouponId: $scope.checkoutCouponId,
      ordCouponCode: $scope.checkoutCouponCode,
      ordPaymentType: 'COD',
      ordAddress: ordAddress
    });


    $http.get(main_url+'Api/add_order?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $rootScope.changeCartNumber();

        $state.go('tab.thankyou');
        //var paytm_url = main_url+'payment/paytm?ORDER_ID=SCH004&CUST_ID=USR001&INDUSTRY_TYPE_ID=Retail&CHANNEL_ID=WEB&TXN_AMOUNT=100';

        //window.open(paytm_url,'_blank'); 

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      $scope.checkaccountaddress = {accountAddress: true};
      $scope.checknewaddress = {newAddress: false};
      $scope.checkcod = {cod: true};
      $scope.checkpaytm = {paytm: false};

      $scope.checkoutAccountAddress = $localStorage.userProfileAddress;

      $scope.checkoutTotalAmount = $localStorage.currentCheckoutTotalAmount;
      $scope.checkoutSubTotalAmount = $localStorage.currentCheckoutSubTotalAmount;
      $scope.checkoutTax1Amount = $localStorage.currentCheckoutTax1Amount;
      $scope.checkoutTax1Rate = $localStorage.currentCheckoutTax1Rate;
      $scope.checkoutTax2Amount = $localStorage.currentCheckoutTax2Amount;
      $scope.checkoutTax2Rate = $localStorage.currentCheckoutTax2Rate;
      $scope.checkoutDiscountAmount = $localStorage.currentDiscountAmount;
      $scope.checkoutCouponStatus = $localStorage.currentCouponStatus;
      $scope.checkoutCouponId = $localStorage.currentCouponId;
      $scope.checkoutCouponCode = $localStorage.currentCouponCode;

      $scope.checkout = { checkoutNewAddress: '' };
    }
  }

})

.controller('ThankyouCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  

  $scope.$on("$ionicView.enter", function(event, data){
    $ionicHistory.clearHistory();
  });

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.backToHome = function(){
    $state.go('tab.dash');
  }

})

.controller('OrdersCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $rootScope.changeGetOrders = function(){

    changeGetOrders();

  }
  

  $scope.refreshOrders = function(){
    getOrders();
  }


  $scope.cancelOrder = function(item){

    var confirmPopup = $ionicPopup.confirm({
      title: 'Order Cancellation',
      template: '<p align="center">Do you want to Cancel this Order?</p>',
      cancelText: 'NO',
      okText: 'YES'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        cancelOrder(item.ordId);
      }else{
        console.log('You are not sure');
      }
    });

  }

  function getOrders(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_user_orders?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $scope.emptyorder=false;

        $scope.orders = response.data.data;


      }else{
        $ionicLoading.hide();
        /*
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });*/

        $scope.emptyorder=true;

        $scope.orders = ''


      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function changeGetOrders(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_user_orders?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

      }else{
        $ionicLoading.hide();

      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function cancelOrder(id){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      ordId: id
    });

    $http.get(main_url+'Api/update_order_cancellation?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        var alertPopup = $ionicPopup.alert({
            title: 'Success!',
            template: '<p align="center">'+response.data.message+'</p>'
        });

        getOrders();


      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });

        getOrders();

      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      getOrders();
    }
  }

})

.controller('AccountCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $rootScope.changeAccountDetails = function(){
    $scope.userProfileAddress = $localStorage.userProfileAddress;
    $scope.userProfileMobileNo = $localStorage.userProfileMobileNo;
    $scope.userProfileName = $localStorage.userProfileName;
  }

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.goToChangePassword = function(){
    $state.go('tab.changepassword');
  }

  $scope.goToUpdateAddress = function(){
    $state.go('tab.updateaddress');
  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      $scope.userProfileAddress = $localStorage.userProfileAddress;
      $scope.userProfileMobileNo = $localStorage.userProfileMobileNo;
      $scope.userProfileName = $localStorage.userProfileName;
    }
  }

})

.controller('ChangepasswordCtrl', function($scope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.changePassword = function(item){

    if(item.usrCurrentPassword == ""){

      $ionicLoading.show({
        template: "Please Enter Current Password",
        duration: 2000
      });

    }else if(item.usrNewPassword == ""){

      $ionicLoading.show({
        template: "Please Enter New Password",
        duration: 2000
      });

    }else if(item.usrNewPasswordC == ""){

      $ionicLoading.show({
        template: "Please Enter Retype New Password",
        duration: 2000
      });

    }else if(item.usrNewPassword == item.usrNewPasswordC){

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });

      var data = $.param({
        usrId: $localStorage.currentUserId,
        usrTokenId: $localStorage.currentUserTokenId,
        usrCurrentPassword: item.usrCurrentPassword,
        usrNewPassword: item.usrNewPassword,
        usrNewPasswordC: item.usrNewPasswordC
      });


      $http.get(main_url+'Api/update_user_password?'+data)
      .then(function(response){

        if(response.data.status == "success"){
          $ionicLoading.hide();

          $state.go('tab.account');

        }else{
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
              template: '<p align="center">'+response.data.message+'</p>'
          });
        }


      },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

    }else{

      $ionicLoading.show({
        template: "Retype New Password doesn't Match",
        duration: 2000
      });

    }


  }

  $scope.backToAccount = function(){
    $state.go('tab.account');
  }

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      $scope.cp = {
        usrCurrentPassword: '',
        usrNewPassword: '',
        usrNewPasswordC: ''
      };
    }
  }

})

.controller('UpdateaddressCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });

  $scope.updateAddress = function(item){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId,
      usrAddress: item.usrAddress
    });

    $http.get(main_url+'Api/update_user_address?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $rootScope.changeUserProfileDetails();

        $state.go('tab.account');

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: '<p align="center">Are you sure you want to Logout?</p>',
      cancelText: 'Cancel',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $localStorage.$reset();
        checkLogin();
      }else{
        console.log('You are not sure');
      }
    });
  }

  $scope.backToAccount = function(){
    $state.go('tab.account');
  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      $scope.ua = {
        usrAddress: $localStorage.userProfileAddress
      };
    }
  }

})

.controller('MainCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {
  
  $scope.data = {
    badgeCount : $localStorage.currentCartNumber
  };

  $rootScope.changeCartNumber = function(){
    changeGetCartNumber();
  }

  $rootScope.changeUserProfileDetails = function(){
    changeGetUserProfileDetails();
  }

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });
  

  checkLogin();

  function changeGetCartNumber(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_cart_number?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $localStorage.currentCartNumber = response.data.cartNumber;

        $scope.data = {
          badgeCount : $localStorage.currentCartNumber
        };

        $rootScope.changeCarts();

      }else{
        $ionicLoading.hide();

        $localStorage.currentCartNumber = 0;

        $scope.data = {
          badgeCount : $localStorage.currentCartNumber
        };

        $rootScope.changeCarts();
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function getCartNumber(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_cart_number?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $localStorage.currentCartNumber = response.data.cartNumber;

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });

        $localStorage.currentCartNumber = 0;
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function getUserProfileDetails(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_user_profile_details?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $localStorage.userProfileName = response.data.usrUserName;
        $localStorage.userProfileMobileNo = response.data.usrMobileNo;
        $localStorage.userProfileAddress = response.data.usrAddress;

      }else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Warning!',
            template: '<p align="center">'+response.data.message+'</p>'
        });
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function changeGetUserProfileDetails(){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    var data = $.param({
      usrId: $localStorage.currentUserId,
      usrTokenId: $localStorage.currentUserTokenId
    });

    $http.get(main_url+'Api/get_user_profile_details?'+data)
    .then(function(response){

      if(response.data.status == "success"){
        $ionicLoading.hide();

        $localStorage.userProfileName = response.data.usrUserName;
        $localStorage.userProfileMobileNo = response.data.usrMobileNo;
        $localStorage.userProfileAddress = response.data.usrAddress;

        $rootScope.changeAccountDetails();
        $rootScope.changeCheckoutAccountAddress();

      }else{
        $ionicLoading.hide();
      }


    },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

  }

  function checkLogin(){
    if(!($localStorage.login)){
      $state.go('login');
    }else{
      getCartNumber();
      getUserProfileDetails();
    }
  }
})

.controller('SlideCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate) {

  $scope.goToLogin = function() {
    $state.go('login');
  }

  $scope.goToSignup = function() {
    $state.go('signup');
  }

  $scope.changeCheckbox = function(item){
    $scope.filter = {red: true};
  }

  $scope.$on("$ionicView.enter", function(event, data){
    checkLogin();
  });


$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
  // note: the indexes are 0-based
  $scope.activeIndex = data.slider.activeIndex;
  $scope.previousIndex = data.slider.previousIndex;
});

  function checkLogin(){
    if($localStorage.login){
      $state.go('tab.dash');
    }else{
      $scope.filter = {red: true};
    }
  }


})

.controller('ForgetPasswordCtrl', function($scope, $rootScope, $stateParams, $state, $http, main_url, $window, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup) {
  
  $scope.$on("$ionicView.enter", function(event, data){
      checkLogin();
  });


  $scope.sendPassword = function(item){

    if(item.usrMobileNo == "" || item.usrMobileNo == null){
      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Please Enter Mobile Number',
        duration: 1000
      });
      return;

    }else{

      var data = $.param({
        usrMobileNo: item.usrMobileNo
      });


      $http.get(main_url+'Api/get_password?'+data)
      .then(function(response){

        if(response.data.status == "success"){

          $ionicLoading.hide();

          /*
          var alertPopup = $ionicPopup.alert({
              title: 'Success!',
              template: '<p align="center">'+response.data.message+'</p>'
          });*/

        }else{
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: 'Warning!',
              template: '<p align="center">'+response.data.message+'</p>'
          });
        }

      },function(reject){
      // error handler 
      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<strong>Connection Issue</strong><br>Please check your Internet Connection',
        duration: 2500
      });
    });

    }


  }


  $scope.backToLogin = function(){
    $state.go('login');
  }

  function checkLogin(){
    if($localStorage.login){
      $state.go('tab.dash');
    }else{
      $scope.login = {usrMobileNo: ''};
    }
  }

});

