'use strict'

/***
 * Widget, which renders N last social posts from the given JSON feed into specified HTML element container
 * @param containerName (string)
 * @param url (string)
 * @param postsNumber (number)
 * @param updateInterval (number)
 * @constructor
 */
function SocialFeedWidget (containerName, url, postsNumber, updateInterval){
    if (!containerName || !url || !postsNumber || !updateInterval) {return;}

    this.container = document.getElementById(containerName);

    if (this.container === null) {return;}

    this._init(url, postsNumber, updateInterval);
}

/***
 * Init function
 * @param url (string)
 * @param postsNumber (number)
 * @param updateInterval (number)
 * @constructor
 */
SocialFeedWidget.prototype._init = function (url, postsNumber, updateInterval) {
    this.url = url;
    this.postsNumber = postsNumber;
    this.updateInterval = updateInterval;
    this.data = [];
    var content = document.createElement('UL');
    for (var i = 0; i < this.postsNumber; i++) {
        var li = document.createElement('LI');
        var item = this._initSocialItemInstance();
        this.data.push(item);
        li.appendChild(item.element);
        content.appendChild(li);
    }
    this.container.appendChild(content);
    this._fetchData();
};
SocialFeedWidget.prototype.updateData = function(res) {
    (function(tmp, data){
        var tmpData = JSON.parse(tmp);
        if (tmpData) {
            for (var i = 0; i < data.length; i++) {
                var val = {
                    postDate: tmpData[i].created_at || '',
                    authorName: tmpData[i].user.name || '',
                    messageBody: tmpData[i].text || ''
                };
                data[i].setNewValue(val);
            }
        }
        tmpData = null;

    })(res.currentTarget.response, this.data);
    res = null;
    arguments[0] = null;
    setTimeout(this._fetchData.bind(this), this.updateInterval);
}
SocialFeedWidget.prototype._fetchData = function () {
    if(!this.xhr){
        this.xhr = new XMLHttpRequest();
        this.xhr.onload = this.updateData.bind(this);
    }
    this.xhr.open('GET', this.url, true);
    this.xhr.send();
}
SocialFeedWidget.prototype._initSocialItemInstance = function() {
    function SocialItem (){
        this.data = {
            postDate: '',
            authorName: '',
            messageBody: ''
        };
        this.element = document.createElement('DIV');
        var postDataHolder = document.createElement('H6');
        this.postDate = document.createTextNode('Post date: ');
        postDataHolder.appendChild(this.postDate);
        this.element.appendChild(postDataHolder);

        var authorNameHolder = document.createElement('H4');
        this.authorName = document.createTextNode('Author name: ');
        authorNameHolder.appendChild(this.authorName);
        this.element.appendChild(authorNameHolder);

        var messageBodyHolder = document.createElement('P');
        this.messageBody = document.createTextNode('');
        messageBodyHolder.appendChild(this.messageBody);
        this.element.appendChild(messageBodyHolder);
    }
    SocialItem.prototype.setNewValue = function (val) {
        // if(!rawObj){
        //     rawObj = {
        //         created_at: '',
        //         user: {
        //             name: ''
        //         },
        //         text: ''
        //     };
        // }
        // var val = JSON.parse(JSON.stringify({
        //     postDate: rawObj.created_at || '',
        //     authorName: rawObj.user.name || '',
        //     messageBody: rawObj.text || ''
        // }));
        // rawObj = null;
        if (this.data.postDate === val.postDate &&
            this.data.authorName === val.authorName &&
            this.data.messageBody === val.messageBody ){
            return;
        }
            this.data = val;
            this.postDate.nodeValue = 'Post date: ' + this.data.postDate;
            this.authorName.nodeValue = 'Author name: ' + this.data.authorName;
            this.messageBody.nodeValue = this.data.messageBody;
    };

    return new SocialItem();
};

