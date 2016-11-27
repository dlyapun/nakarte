import L from 'leaflet';
import {XMLHttpRequestPromise} from 'lib/xhr-promise/xhr-promise';
import {notifyXhrError} from 'lib/notifications/notifications';

L.Layer.GeoJSONAjax = L.GeoJSON.extend({
        options: {
            requestTimeout: 30000
        },

        initialize: function(url, options) {
            L.GeoJSON.prototype.initialize.call(this, null, options);
            this.url = url;
        },

        loadData: function() {
            if (this._loadStarted) {
                return;
            }
            this._loadStarted = true;
            const {promise} = XMLHttpRequestPromise(this.url,
                {responseType: 'json', timeout: this.options.requestTimeout});
            promise.then((xhr) => this.addData(xhr.response),
                (xhr) => notifyXhrError(xhr, `GeoJSON data from ${this.url}`))
        },

        onAdd: function(map) {
            L.GeoJSON.prototype.onAdd.call(this, map);
            this.loadData();
        }
    }
);
