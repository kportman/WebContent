var app = angular.module("funItaly", []);

app.controller('regCont', ['$scope', '$http',
	function ($scope, $http){
	$scope.username="";
	$scope.password="";
	$scope.nickname="";
	$scope.description="";
	$scope.imageLink="";
	
	$scope.registration = function(){
		alert("I'm in registration function");
		$http({
			method:'POST',
			url:"/FunItaly/registration",
			transformRequest: function(arr) {
				
				var string = [];
				for( var i in arr )
				{
					string.push(encodeURIComponent(i) + "=" + encodeURIComponent(arr[i]));
				}
				return string.join("&");
			},
			data: { username: $scope.username, password: $scope.password, nickname: $scope.nickname, description: $scope.description , imageLink: $scope.imageLink },
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success( function(info){
			if(info == "Ok")
			{
				window.location = "index.html";
			}

		});// end success
		
	};// end registration function 
	}]);//end regCont controller

app.controller('signCont', ['$scope', '$http',
                       	function ($scope, $http){
                       	$scope.username="";
                       	$scope.password="";
                       	$scope.wrongUserOrPass ="";
                       	
                       	$scope.login = function(){
                       		alert("I'm in login function");
                       		$http({
                       			method:'POST',
                       			url:"/FunItaly/login",
                       			transformRequest: function(arr) {
                       				
                       				var string = [];
                       				for( var i in arr )
                       				{
                       					string.push(encodeURIComponent(i) + "=" + encodeURIComponent(arr[i]));
                       				}
                       				return string.join("&");
                       			},
                       			data: { username: $scope.username, password: $scope.password },
                       			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                       		}).success( function(data){
                       			if (data == "userInvalid") {
                       				$scope.wrongUserOrPass="Username or Password are invalid!";
                				} else {
                					window.localStorage.username=data[0];
                					alert(window.localStorage.username);
                					window.localStorage.photoLink=data[1];
                					window.localStorage.nickname=data[2];
                					window.localStorage.description=data[3];
                       				window.location = "main.html";
                				}
                       		});// end success	
                       	};// end  login function 
}]);//end signCont controller

app.controller('mainCont', ['$scope', '$http',
                       	function ($scope, $http){
                       	$scope.nickname = window.localStorage.nickname;
                       	
                       	$scope.askQuestion = function(){
                       		alert("I'm in ask question function");
                       		$http({
                       			method:'POST',
                       			url:"/FunItaly/question",
                       			transformRequest: function(arr) {
                       				
                       				var string = [];
                       				for( var i in arr )
                       				{
                       					string.push(encodeURIComponent(i) + "=" + encodeURIComponent(arr[i]));
                       				}
                       				return string.join("&");
                       			},
                       			data: { nickname: $scope.nickname, question: $scope.question, topic: $scope.topic },
                       			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                       		}).success( function(info){
                       			if(info == "Ok")
                    			{
                       				alert("Ok");
                       				window.location = "newest.html";
                    			}
                       		});// end success
                       		
                       	};// end  ask question function 
}]);//end mainCont controller

app.controller('profileCont', ['$scope', '$http',
                           	function ($scope, $http){
                    $scope.nickname =  window.localStorage.nickname;
                    $scope.description =  window.localStorage.description;
                    $scope.photoLink = window.localStorage.photoLink;      	
                           	
    }]);//end profileCont controller

app.controller('newestCont', ['$scope', '$http',
                              	function ($scope, $http){
                      $scope.questions = {};
                      $scope.writeReply = false;
                      $scope.showReply = false;
                      $scope.clickToAns = true;
                      $scope.qAnswer = "";
                      
                      
                      $scope.display = function(){
                    	  alert("I'm in display function");
	                      $http({ 
	      					method: 'GET',
	      					url: '/FunItaly/getQuestions',
	      					params: { getQuestions: "newest" , offset: 0 },
	      					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	      				}).success( function(data) {
	      					$scope.questions = data;
	      				});
                     }   
                      
                      $scope.answer = function(){
                    	  $scope.writeReply = true;
                    	  $scope.clickToAns = false;
                    	  
                      }
                      $scope.publish = function(){
                    	  $scope.writeReply = false;
                    	  $scope.showReply = true;
                      }
                                          	
       }]);//end newestCont controller