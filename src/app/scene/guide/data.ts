export let GUIDE_DATA = {
    room_init:
    {
        "userId": GM.user_id,
        "users": [{
            "roomId": "1",
            "tableId": "1111111",
            "gameStatus": "1",
            "avatar": "",
            "nickname": "test1",
            "seatId": "1",
            "userId": GM.user_id,
            "gold": 100,
            "diamond": 123123,
            "batteryLevel": "1",
            "curBatteryLevel": "1",
            "vipLevel": "0",
            "isInGuide": true
        }],
        "tableInfo": {
            "status": "1",
            "createTime": "2017-03-07 17:23:38:454",
            "roomId": "1",
            "roomType": "1",
            "curFishNo": "108",
            "gameType": 'normal'
        },
        "fish": [{
            "typeId": "2",
            "fishId": "1",
            "startTime": "1488878618530",
            "totalTime": 30,
            "usedTime": 10,
            "from": "left",
            "displaceType": "path",
            "pathId": "1",
            "pathNo": "2",
        }, {
            "typeId": "10",
            "fishId": "2",
            "startTime": "1488878618530",
            "from": "left",
            "totalTime": 30,
            "usedTime": 10,
            "displaceType": "path",
            "pathId": "1",
            "pathNo": "20"
        }],
        "userItems": {
            "2001": {
                "count": 1,
                "coolTime": 10
            },
            "2002": {
                "count": 1,
                "coolTime": 10,
                "perPrice": 3
            },
            "2003": {
                "count": 1,
                "coolTime": 10,
                "perPrice": 3
            },
            "2004": {
                "count": 0,
                "coolTime": 10,
                "perPrice": 3
            },
            "2005": {
                "count": 0,
                "coolTime": 10,
                "perPrice": 3
            },
            "2006": {
                "count": 10,
                "coolTime": 10,
                "perPrice": 3
            },
            "4001": {
                "count": 0,
                "coolTime": 10,
                "perPrice": 3
            },
            "4002": {
                "count": 0,
                "coolTime": 10
            },
            "4003": {
                "count": 0,
                "coolTime": 10
            },
            "4004": {
                "count": 0,
                "coolTime": 10
            },
            "4005": {
                "count": 0,
                "coolTime": 10
            }
        }
    },
    small_fish: {
        hit: {
            "userId": GM.user_id,
            "fish": {
            },
            "hitPrize": {
                "isHit": true,
                "awardAmount": 100
            },
            "totalPrize": 100,
            "amount": 56388325,
            "dropItem": {
                "userId": GM.user_id,
                "bulletPos": {
                    x: 500,
                    y: 500
                },
                "item": [{
                    "itemId": "1002",
                    "count": 10
                }]
            }
        },
        add_fish: {
            "typeId": "2",
            "fishId": "2",
            "from": "left",
            "totalTime": 30,
            "usedTime": 0,
            "displaceType": "path",
            "pathId": "1",
            "pathNo": "5"
        }
    },
    hit_big_fish: {
        "userId": GM.user_id,
        fish_data: [
            {
                "typeId": "22",
                "fishId": "123423423",
                "totalTime": 60 * 60 * 60,
                "usedTime": 0,
                "displaceType": "function",
                "funList": [{
                    "funNo": "3",
                    "len": 6205,
                    "funParam": [{
                        "x": 973,
                        "y": 374
                    },
                    {
                        "x": 973,
                        "y": 374
                    }]
                }],
            }
        ],
        "fish": {
        },
        "hitPrize": {
            "isHit": true,
            "awardAmount": 0
        },
        "totalPrize": 12000,
        "amount": 56388325,
        "dropItem": {
            "userId": GM.user_id,
            "bulletPos": {
                x: 500,
                y: 500
            },
            "item": [{
                "itemId": "1003",
                "count": 45
            }]
        }
    },
    "get_up_battery_info": {
        "userId": GM.user_id,
        "canUp": '1',
        "prizeGold": '10',
        "nextLevel": '2',
        "userDiamond": '10',
        "costDiamond": '10'
    },
    "up_battery_info": {
        "userId": GM.user_id,
        "costDiamond": '200',
        "reward": {
            1001: 200,
            1002: 200
        },
        "status": '1',
        "curBatteryLevel": '2'
    },
    "fish_ticket_info": {
        "needCount": 2,
        "ticketPool": 0,
        "killedCount": 45,
        "userId": GM.user_id
    },
    "show_lottery": {
        "userId": GM.user_id,
        "type": "ticket",
        "list": {
            "1": {
                "list": [{
                    "item_id": "1003",
                    "num": "2"
                }, {
                    "item_id": "1003",
                    "num": "3"
                }, {
                    "item_id": "1003",
                    "num": "4"
                }, {
                    "item_id": "1003",
                    "num": "5"
                }, {
                    "item_id": "1003",
                    "num": "200"
                }, {
                    "item_id": "1003",
                    "num": "10"
                }],
                "count": "2",
                "amount": "0",
                "canDraw": true,
                "canHighLevel": true,
                "show": {
                    "type": "count",
                    "needCount": 1,
                    "killedCount": 1,
                    "level": "1"
                }
            }
        },
        "needCount": 1,
        "killedCount": 1,
        "myPoolAmount": 4959,
        "myLevel": "1"
    },
    "daw_lottery": {
        "userId": GM.user_id,
        "type": "ticket",
        "status": 1,
        "result": {
            "index": "1",
            "data": [{
                "itemId": "1003",
                "count": 3
            }]
        }
    },
    "server_data": null
}