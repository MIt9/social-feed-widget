'use strict'

/***
 * Widget, which renders N last social posts from the given JSON feed into specified HTML element container
 * @param containerName (string)
 * @param url (string)
 * @param postsNumber (number)
 * @param updateInterval (number)
 * @constructor
 */
function SocialFeedWidget(containerName, url, postsNumber, updateInterval) {
    if (!containerName || !url || !postsNumber || !updateInterval) {
        return;
    }

    this.container = document.getElementById(containerName);

    if (this.container === null) {
        return;
    }

    this._init(url, postsNumber, updateInterval);
}

/***
 * Init function
 * @param {string} url
 * @param {number} postsNumber
 * @param {number} updateInterval
 * @constructor
 */
SocialFeedWidget.prototype._init = function (url, postsNumber, updateInterval) {
    this.url = url;
    this.postsNumber = postsNumber;
    this.updateInterval = updateInterval;
    this.items = [];
    var content = document.createElement('DIV');
    content.className = 'sfw-holder';
    for (var i = 0; i < this.postsNumber; i++) {
        var item = this._initSocialItemInstance();
        this.items.push(item);
        content.appendChild(item.element);
    }
    this.container.appendChild(content);
    _fetchData(this.url, this.items, this.updateInterval);

    /***
     * Update data in model
     * @param {string} url
     * @param {array} items
     * @param {number} interval
     * @param {string} res
     */
    function updateData(url, items, interval, res) {
            var tmpData = [];
            try {
                tmpData = JSON.parse(res);
            } catch (e) {
                console.log(e);
            }
            for (var i = 0; i < items.length; i++) {
                var val = null;
                if (tmpData[i] && tmpData[i].created_at && tmpData[i].text && tmpData[i].user && tmpData[i].user.name) {
                    val = {
                        postDate: tmpData[i].created_at || '',
                        authorName: tmpData[i].user.name || '',
                        messageBody: tmpData[i].text || ''
                    };
                }
                items[i].setNewValue(val);
            }
            tmpData = null;
        setTimeout(_fetchData, interval, url, items, interval);
        url = items = interval = res = null;
    }

    /***
     * Fetching data
     * @param {string} url
     * @param {array} items
     * @param {number} interval
     * @private
     */
    function _fetchData(url, items, interval) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function (url, items, interval) {
            return function (e) {
                var r = e.target;
                if (r.readyState !== 4) return;

                if (r.status === 200) {
                    updateData(url, items, interval, r.response);
                    r.abort();
                    url = items = interval = r = null;
                }
            }
        }(url, items, interval);
        xhr.onerror = function (url, items, interval) {
            return function errorWrapper(e) {
                console.error(e);
                setTimeout(_fetchData, interval, url, items, interval);
                url = items = interval = null;
            }
        }(url, items, interval);
        xhr.open('GET', url + '?_=' + new Date().getTime(), true);
        xhr.send();
    }

};
/***
 * Creating Dom nodes with model and controller
 * @returns {SocialItem}
 * @private
 */
SocialFeedWidget.prototype._initSocialItemInstance = function () {
    /***
     * Constructor of single item
     * @constructor
     */
    function SocialItem() {
        this.data = {
            isHidden: true,
            originalDate: '',
            postDate: '',
            authorName: '',
            messageBody: ''
        };
        this.element = document.createElement('DIV');
        this.element.className = 'sfw-item-wrapper';
        this.element.style.display = this.data.isHidden ? 'none' : 'block';

        var authorNameHolder = document.createElement('span');
        authorNameHolder.className = 'sfw-item-author';
        this.authorName = document.createTextNode('');
        authorNameHolder.appendChild(this.authorName);
        this.element.appendChild(authorNameHolder);

        var postDateHolder = document.createElement('span');
        postDateHolder.className = 'sfw-item-date';
        this.postDate = document.createTextNode('');
        postDateHolder.appendChild(this.postDate);
        this.element.appendChild(postDateHolder);

        var messageBodyHolder = document.createElement('P');
        messageBodyHolder.className = 'sfw-item-text';
        this.messageBody = document.createTextNode('');
        messageBodyHolder.appendChild(this.messageBody);
        this.element.appendChild(messageBodyHolder);
    }

    /***
     * Model setter
     * @param {obj{postDate: string, authorName: string, messageBody:string}} val
     */
    SocialItem.prototype.setNewValue = function (val) {
        if (val === null) {
            this.data = {
                isHidden: true,
                originalDate: '',
                postDate: '',
                authorName: '',
                messageBody: ''
            };
        } else if (this.data.originalDate === val.postDate &&
            this.data.authorName === val.authorName &&
            this.data.messageBody === val.messageBody) {
            return;
        } else {
            var reformatDate = function (dateString) {
                function formatTo00(number) {
                    var f = '' + number;
                    return f.length === 1 ? '0' + f : f;
                }

                var t = dateString.split(' ');
                var parseReadyDateString = t[0] + ', ' + t[2] + ' ' + t[1] + ' ' + t[5] + ' ' + t[3] + ' ' + t[4];
                var d = new Date(parseReadyDateString);
                var day = formatTo00(d.getDate());
                var month = formatTo00(d.getMonth() + 1);
                var hours = formatTo00(d.getHours());
                var minutes = formatTo00(d.getMinutes());
                var result = day + '/' + month + '/' + d.getFullYear() + ' ' + hours + ':' + minutes;
                return result;
            }

            val.originalDate = val.postDate;
            val.postDate = reformatDate(val.postDate);
            val.isHidden = false;
            this.data = val;
        }
        this.element.style.display = this.data.isHidden ? 'none' : 'block';
        this.postDate.nodeValue = this.data.postDate;
        this.authorName.nodeValue = this.data.authorName;
        this.messageBody.nodeValue = this.data.messageBody;
    };
    return new SocialItem();
};
