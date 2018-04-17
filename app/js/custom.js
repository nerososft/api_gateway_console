/**=========================
 * Module: apinote.js
 * API 文档
=========================*/

App.controller('ApiDocument', ['$rootScope', '$scope', '$http', 'ngDialog', 'Notify',

    function($rootScope, $scope, $http, ngDialog, Notify) {
        'use strict';

        $scope.datas = '';
        $scope.wysiwygContent = '<p> Write something here.. </p>';
        $scope.mockDialog = '';
        $scope.addMockLoading = false;

        $http({
            method: "GET",
            url: $rootScope.api,
            params: {
                method: "sys.doc",
                params: {},
                sysParams: {
                    userName: "root",
                    passWord: "root"
                }
            }
        }).success(function(data, status, headers, config) {
            $scope.datas = data.data
        }).error(function(data, status, headers, config) {
            Notify.alert('Server Error', { status: 'danger' });
        });

        $scope.getDetail = function(index) {
            $scope.detailData = $scope.datas[index]
            ngDialog.open({
                template: 'getDetail',
                className: 'ngdialog-theme-default',
                scope: $scope,
            });
        };

        $scope.mock = function(index) {
            $scope.detailData = $scope.datas[index]
            $scope.mockDialog = ngDialog.open({
                template: 'addMock',
                className: 'ngdialog-theme-default',
                scope: $scope,
            });
        }

        $scope.addMock = function() {
            $scope.addMockLoading = true;

            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.mock.add",
                    params: {
                        apiName: $scope.detailData.apiName,
                        apiReturn: $scope.detailData.mockData
                    },
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                switch (data.data) {
                    case true:
                        $scope.mockDialog.close();
                        Notify.alert('Add Mock Data Success', { status: 'success' });
                        $scope.addMockLoading = false;
                        break;
                    default:
                        Notify.alert('Already Have Mock Data', { status: 'warning' });
                        $scope.mockDialog.close();
                        $scope.addMockLoading = false;
                        break;
                }
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
                $scope.addMockLoading = false;
            });
        }

    }
]);

/**=========================
 * Module: origin.js
 * Origin 控制
=========================*/

App.controller('OriginControl', ['$rootScope', '$scope', '$http', 'ngDialog', 'Notify',

    function($rootScope, $scope, $http, ngDialog, Notify) {
        'use strict';

        $scope.datas = '';
        $scope.post = {
            name: '',
            origin: ''
        };

        // 获取origin信息
        $scope.init = function() {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.origin.list",
                    params: {},
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                $scope.datas = data.data
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        }

        // 添加安全域
        $scope.addOrigin = function() {
            if ($scope.post.name == '' || $scope.post.origin == '') {
                Notify.alert(
                    'Please Fill In The Origin Information', { status: 'warning' }
                );
                return;
            }
            $scope.datas = '';

            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.origin.add",
                    params: $scope.post,
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                switch (data.code) {
                    case 1000:
                        $scope.init();
                        Notify.alert(
                            'Add Origin: ' + $scope.post.origin + ' Successfully', { status: 'success' }
                        );
                        $scope.post.name = '';
                        $scope.post.origin = '';
                        break;
                    default:
                        Notify.alert(
                            'Add Origin: ' + $scope.post.origin + ' Failure', { status: 'danger' }
                        );
                        break;
                }
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        // 删除安全域
        $scope.delOrigin = function(index) {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.origin.del",
                    params: $scope.datas[index],
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                switch (data.code) {
                    case 1000:
                        Notify.alert(
                            'Delete Origin: ' + $scope.datas[index].origin + ' Successfully', { status: 'success' }
                        );
                        $scope.datas.splice(index, 1);
                        break;
                    default:
                        Notify.alert(
                            'Delete Origin: ' + $scope.datas[index].origin + ' Failure', { status: 'danger' }
                        );
                        break;
                }
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        $scope.init();

    }
]);

/**=========================
 * Module: iptable.js
 * 黑名单
=========================*/

App.controller('IpTable', ['$rootScope', '$scope', '$http', 'ngDialog', 'Notify', '$timeout', 

    function($rootScope, $scope, $http, ngDialog, Notify, $timeout) {
        'use strict';

        $scope.datas = '';
        $scope.status = {
            status: false,
            disabled: true
        };
        $scope.post = {
            ip: ''
        };

        $scope.init = function() {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.ipTables.list",
                    params: {},
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
            	$scope.datas = data.data;
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        $scope.statusinit = function() {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.ipTables.status.get",
                    params: {},
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                $scope.status.status = data.data;
                $scope.status.disabled = false;
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        // 添加IP
        $scope.addIP = function() {
            if ($scope.post.ip == '') {
                Notify.alert(
                    'Please Fill In The IP Information', { status: 'warning' }
                );
                return;
            }

            $scope.datas = '';

            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.ipTables.add",
                    params: $scope.post,
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                switch (data.code) {
                    case 1000:
                        $scope.init();
                        Notify.alert(
                            'Add IP: ' + $scope.post.ip + ' Successfully', { status: 'success' }
                        );
                        $scope.post.ip = '';
                        break;
                    default:
                        Notify.alert(
                            'Add IP: ' + $scope.post.ip + ' Failure', { status: 'danger' }
                        );
                        break;
                }
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        // 删除IP
        $scope.delIP = function(index) {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.ipTables.del",
                    params: {
                        ip: $scope.datas[index]
                    },
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                switch (data.code) {
                    case 1000:
                        Notify.alert(
                            'Delete IP: ' + $scope.datas[index] + ' Successfully', { status: 'success' }
                        );
                        $scope.datas.splice(index, 1);
                        break;
                    default:
                        Notify.alert(
                            'Delete IP: ' + $scope.datas[index] + ' Failure', { status: 'danger' }
                        );
                        break;
                }
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        }

        // 修改防火墙状态
        $scope.changeStatus = function() {
            $scope.status.disabled = true;
            var ipstatus = $scope.status.status;

            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.ipTables.status.set",
                    params: {
                        isOpen: ipstatus
                    },
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                var msg = ipstatus ? 'Open' : 'Close';
                switch (data.code) {
                    case 1000:
                        Notify.alert(
                            msg + ' IPTables Successfully', { status: 'success' }
                        );
                        break;
                    default:
                        Notify.alert(
                            msg + ' IPTables Failure', { status: 'danger' }
                        );
                        break;
                }
                $scope.status.disabled = false;
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
                $scope.status.disabled = false;
            });
        };

        $scope.init();
        $scope.statusinit();

    }
]);


/**=========================
 * Module: mock.js
 * Mock 列表
=========================*/

App.controller('MockList', ['$rootScope', '$scope', '$http', 'ngDialog', 'Notify',

    function($rootScope, $scope, $http, ngDialog, Notify) {
        'use strict';

        $scope.datas = '';
        $scope.status = {
            status: false,
            disabled: true
        };

        $scope.init = function() {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.mock.list",
                    params: {},
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                $scope.datas = data.data;
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        $scope.statusinit = function() {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.mock.status.get",
                    params: {},
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                $scope.status.status = data.data;
                $scope.status.disabled = false;
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        };

        // 删除Mock 数据
        $scope.delMock = function(index) {
            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.mock.del",
                    params: {
                        mockName: $scope.datas[index].ApiName
                    },
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                switch (data.code) {
                    case 1000:
                        Notify.alert(
                            'Delete Mock Data About API: ' + $scope.datas[index].ApiName + ' Successfully', { status: 'success' }
                        );
                        $scope.datas.splice(index, 1);
                        break;
                    default:
                        Notify.alert(
                            'Delete Mock Data Ablout API: ' + $scope.datas[index].ApiName + ' Failure', { status: 'danger' }
                        );
                        break;
                }
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
            });
        }

        // 修改Mock状态
        $scope.changeStatus = function() {
            $scope.status.disabled = true;
            var mockstatus = $scope.status.status;

            $http({
                method: "GET",
                url: $rootScope.api,
                params: {
                    method: "sys.mock.status.set",
                    params: {
                        isOpen: mockstatus
                    },
                    sysParams: {
                        userName: "root",
                        passWord: "root"
                    }
                }
            }).success(function(data, status, headers, config) {
                var msg = mockstatus ? 'Open' : 'Close';
                switch (data.code) {
                    case 1000:
                        Notify.alert(
                            msg + ' Mock Successfully', { status: 'success' }
                        );
                        break;
                    default:
                        Notify.alert(
                            msg + ' Mock Failure', { status: 'danger' }
                        );
                        break;
                }
                $scope.status.disabled = false;
            }).error(function(data, status, headers, config) {
                Notify.alert('Server Error', { status: 'danger' });
                $scope.status.disabled = false;
            });
        };

        $scope.init();
        $scope.statusinit();

    }
]);