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

app.controller('byTopicCont', ['$scope', '$http', 'appFactory',
                            	function ($scope, $http, appFactory){
                    $scope.questions = {};
                    $scope.topics = {};
                    $scope.prevNextShow = false;
                    $scope.show = true;
                    $scope.hide = false;
                    $scope.offset = 0;
                    
                    $scope.bringQByTopic= function(topic){
                    	$scope.display(topic,$scope.offset);
                    }
                    
                    $scope.bringTopics = function(){
                    	$http({ 
         				   method: 'GET',
         				   url: '/FunItaly/byTopic',
         				   params: { get: "allTopics" },
         				   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
         				}).success(function(data){
         					$scope.topics = data;
         					});
                    }
                    $scope.voteQuesUp = function(qid){
                  	  //check if user published this question
                  	  appFactory.vote($http, qid, 1, "question", 1);
                    }
                    $scope.voteQuesDown = function(qid){
                  	  appFactory.vote($http, qid, 1, "question", -1);
                    }
                    
                    $scope.voteAnsUp = function(qid, aid){
                  	  appFactory.vote($http, qid, aid, "answer", 1);
                    }
                    
                    $scope.voteAnsDown = function(qid, aid){
                  	  appFactory.vote($http, qid, aid, "answer", -1);
                    }
                    
                    $scope.prev = function(type){
                  	  if(($scope.offset - 20) >= 0)
              		  {
                  		  //disable prev
                  		  $scope.offset = $scope.offset - 20;
                  		  $scope.display(type,$scope.offset);
              		  }
                  	  
                    }
                    $scope.next = function(type){
                  	  if(!($scope.questions.length < 20))
                  	  {
                  		  //disable next
                  		  $scope.offset = $scope.offset + 20;
                      	  $scope.display(type,$scope.offset);
                  	  } 
                    }
                    
                    $scope.display = function(type, offs){
                  	  var req = appFactory.display($http,type, offs);
                  	  req.success(function(data){$scope.questions = data;});
                    }
                    
                    $scope.getAnswers = function(id, index){// gets question id and returns the answers
                  	  var req = appFactory.getAnswers($http,id);
                  	  req.success(function(data){$scope.questions[index].answers = data;});
                  	  //bug is here?(does not always show the answer)
                    }    
                      
                    $scope.publish = function(qid, ans, ansNow, index){
                  	  appFactory.publish($http,qid, window.localStorage.nickname, ans);
                  	  $scope.getAnswers(qid, index);  
                    }
     }]);//end byTopicCont controller

app.controller('existingCont', ['$scope', '$http', 'appFactory',
                            	function ($scope, $http, appFactory){
                    $scope.questions = {};
                    $scope.show = true;
                    $scope.hide = false;
                    $scope.offset = 0;
                    
                    $scope.voteQuesUp = function(qid){
                  	  //check if user published this question
                  	  appFactory.vote($http, qid, 1, "question", 1);
                    }
                    $scope.voteQuesDown = function(qid){
                  	  appFactory.vote($http, qid, 1, "question", -1);
                    }
                    
                    $scope.voteAnsUp = function(qid, aid){
                  	  appFactory.vote($http, qid, aid, "answer", 1);
                    }
                    
                    $scope.voteAnsDown = function(qid, aid){
                  	  appFactory.vote($http, qid, aid, "answer", -1);
                    }
                    
                    $scope.prev = function(type){
                  	  if(($scope.offset - 20) >= 0)
              		  {
                  		  //disable prev
                  		  $scope.offset = $scope.offset - 20;
                  		  $scope.display(type,$scope.offset);
              		  }
                  	  
                    }
                    $scope.next = function(type){
                  	  if(!($scope.questions.length < 20))
                  	  {
                  		  //disable next
                  		  $scope.offset = $scope.offset + 20;
                      	  $scope.display(type,$scope.offset);
                  	  } 
                    }
                    
                    $scope.display = function(type, offs){
                  	  var req = appFactory.display($http,type, offs);
                  	  req.success(function(data){$scope.questions = data;});
                    }
                    
                    $scope.getAnswers = function(id, index){// gets question id and returns the answers
                  	  var req = appFactory.getAnswers($http,id);
                  	  req.success(function(data){$scope.questions[index].answers = data;});
                  	  //bug is here?(does not always show the answer)
                    }    
                      
                    $scope.publish = function(qid, ans, ansNow, index){
                  	  appFactory.publish($http,qid, window.localStorage.nickname, ans);
                  	  $scope.getAnswers(qid, index);  
                    }
     }]);//end existingCont controller

app.controller('newestCont', ['$scope', '$http', 'appFactory',
                              	function ($scope, $http, appFactory){
                      $scope.questions = {};
                      $scope.show = true;
                      $scope.hide = false;
                      $scope.offset = 0;
                      
                      $scope.voteQuesUp = function(qid){
                    	  //check if user published this question
                    	  appFactory.vote($http, qid, 1, "question", 1);
                      }
                      $scope.voteQuesDown = function(qid){
                    	  appFactory.vote($http, qid, 1, "question", -1);
                      }
                      
                      $scope.voteAnsUp = function(qid, aid){
                    	  appFactory.vote($http, qid, aid, "answer", 1);
                      }
                      
                      $scope.voteAnsDown = function(qid, aid){
                    	  appFactory.vote($http, qid, aid, "answer", -1);
                      }
                      
                      $scope.prev = function(type){
                    	  if(($scope.offset - 20) >= 0)
                		  {
                    		  //disable prev
                    		  $scope.offset = $scope.offset - 20;
                    		  $scope.display(type,$scope.offset);
                		  }
                    	  
                      }
                      $scope.next = function(type){
                    	  if(!($scope.questions.length < 20))
                    	  {
                    		  //disable next
                    		  $scope.offset = $scope.offset + 20;
                        	  $scope.display(type,$scope.offset);
                    	  } 
                      }
                      
                      $scope.display = function(type, offs){
                    	  var req = appFactory.display($http,type, offs);
                    	  req.success(function(data){$scope.questions = data;});
                      }
                      
                      $scope.getAnswers = function(id, index){// gets question id and returns the answers
                    	  var req = appFactory.getAnswers($http,id);
                    	  req.success(function(data){$scope.questions[index].answers = data;});
                    	  //bug is here?(does not always show the answer)
                      }    
                        
                      $scope.publish = function(qid, ans, ansNow, index){
                    	  appFactory.publish($http,qid, window.localStorage.nickname, ans);
                    	  $scope.getAnswers(qid, index);  
                      }
       }]);//end newestCont controller

app.factory("appFactory", function() {

	return {
		publish: function($http, qid, nick, ans) {
      	  $http({
   			method:'POST',
   			url:"/FunItaly/answer",
   			transformRequest: function(arr) {
   				
   				var string = [];
   				for( var i in arr )
   				{
   					string.push(encodeURIComponent(i) + "=" + encodeURIComponent(arr[i]));
   				}
   				return string.join("&");
   			},
   			data: { id: qid, nickname: nick, answer: ans },
   			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
   		}).success( function(info){
   			if(info == "Ok")
			{
   				alert("Ok");
   				
			}
   		});// end success 

		},//end publish
		
		vote: function($http, qid, aid, type, upOrDown) {
	      	  $http({
	   			method:'POST',
	   			url:"/FunItaly/rating",
	   			transformRequest: function(arr) {
	   				
	   				var string = [];
	   				for( var i in arr )
	   				{
	   					string.push(encodeURIComponent(i) + "=" + encodeURIComponent(arr[i]));
	   				}
	   				return string.join("&");
	   			},
	   			data: { voteType: type, vote: upOrDown, quesID: qid, ansID: aid },
	   			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	   		}).success( function(info){
	   			if(info == "Ok")
				{
	   				alert("Ok");
	   				
				}
	   		});// end success 

			},//end vote
		getAnswers: function($http,id){

			return $http({ 
					method: 'GET',
					url: '/FunItaly/answer',
					params: { qid: id },
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
		}, //end getAnswers
	   display: function($http,type, offs){
		   
		  return  $http({ 
				   method: 'GET',
				   url: '/FunItaly/getQuestions',
				   params: { getQuestions: type , offset: offs },
				   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}) 
	   } //end display
	};
});

