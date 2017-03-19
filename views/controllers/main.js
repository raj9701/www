var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider.state('Home', {
      url: '/home',
      //params: {
        // obj: null
       //},
      templateUrl: 'template/home.html',       
      controller: 'HomeCtrl'
    });   
    $stateProvider.state('Register', {
      url: '/register',     
      params: {'index': null, 'anotherKey': null},
      templateUrl: 'template/register.html',
      controller: 'RegCtrl'      
    });
    $stateProvider.state('Login', {
      url: '/login',
      templateUrl: 'template/login.html', 
      controller: 'LogCtrl'   
    });
    $stateProvider.state('Userlist', {
      url: '/userlist',
      templateUrl: 'template/userlist.html', 
      controller: 'UserCtrl'   
    });
    $urlRouterProvider.otherwise('/home'); 
  });

app.controller('HomeCtrl', function($scope,$http,$state, $stateParams) {
    //console.log("Hello User")
    //$scope.test="Hello User";            
    $http.get('/check').then(function(response){
          console.log(response.data);
          if(response.data === 'no'){
            console.log('no session')
            $state.go('Login',{reload: true});            
          }else{
            console.log(response.data)
            //$state.transitionTo($state.current, $stateParams,{reload: true});           
            $scope.test="Hello User";
            $scope.user=response.data.username;
            $scope.logout = function(){
               $http.post('/logout').then(function(response){
                    if(response.data==='yes'){
                        $state.go('Login',{reload:true});
                    }
               });
            }           
          }
      })  
  });
      
app.controller('RegCtrl', function($scope, $http, $state, $stateParams,$timeout) {        
    $scope.first="Hello Register";     

    var anotherKey = $stateParams.anotherKey;    
    $scope.success_msg = anotherKey;
          $timeout(function () {
                $scope.success_msg = "";
                     }, 5000);

    $scope.register = function(){
    console.log($scope.reguser)
    $http.post('/register',$scope.reguser).then(function(response){
      var data = response.data;
      console.log(data);    
      //var result = { product:'jimbob' };     
       $state.go('Register', { 'index': 123, 'anotherKey': 'Registration Successful' },{reload: true});                                      
      })        
    };    

  });

app.controller('LogCtrl', function($scope,$http, $state, $stateParams,$timeout) {   
    $scope.login="Hello Login";
    $scope.msg = "Please Login First";
     $http.get('/check').then(function(response){
          //console.log(response.data);
          if(response.data === 'no'){
            console.log('no session')
            $scope.login = function(){
             $http.post('/loginuser',$scope.loguser).then(function(response){                  
                var data = response.data;
                console.log(data); 
                 if(data){
                  $state.go('Home');             
                  }else{           
                    $state.transitionTo($state.current, $stateParams);                    
                     $scope.error_msg = "Invalid Username or Password";
                     $timeout(function () {
                           $scope.error_msg = "";
                     }, 5000);                    
                    }
                 })
               }            
          }else{
            console.log(response.data)
            $state.go('Home');
          }
      }) 
    

  });

app.controller('UserCtrl', function($scope,$http) {   
    $scope.Userlist="Hello Userlisting";

  var refresh = function(){   
     $http.get('/contactlists').then(function(response){
      var data = response.data;
        console.log("i got the data");
        console.log(data);
        $scope.contactlist = data;  
        $scope.contact = null;              
    });    
   };
 refresh();

   $scope.addcontact = function(){
    console.log($scope.contact)
    $http.post('/contactlist',$scope.contact).then(function(response){
      var data = response.data;
      console.log(data);            
      refresh();                    
    })        
  };
   $scope.remove = function(id){
    console.log(id);
    $http.delete('/contactlist/'+id).then(function(response){
      refresh();
    })
   };  
   $scope.edit = function(id){
    console.log(id);
    $http.get('/contactlist/'+id).then(function(response){
      $scope.contact = response.data;      
    });
   };
   $scope.update = function(){
      console.log($scope.contact._id);
      $http.put('/contactlist/' + $scope.contact._id, $scope.contact).then(function(response){
        refresh();        
      })      
   };    


   
  });

