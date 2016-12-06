/*!!
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license <http://www.opensource.org/licenses/mit-license.php>
 * @author Miller Medeiros <http://millermedeiros.com/>
 * @version 0.6.3
 * @build 187 (07/11/2011 10:14 AM)
 */
(function(global){
    var signals = /** @lends signals */{
        VERSION : '0.6.3'
    };
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this._priority = priority || 0;
    }
    SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {
        active : true,
        params : null,
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener) : null;
        },
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },
        getListener : function () {
            return this._listener;
        },
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },
        isOnce : function () {
            return this._isOnce;
        },
        toString : function () {
            return '[SignalBinding isOnce: ' + this._isOnce +', isBound: '+ this.isBound() +', active: ' + this.active + ']';
        }
    };
    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }
    signals.Signal = function () {
        this._bindings = [];
    };
    signals.Signal.prototype = {
        _shouldPropagate : true,
        active : true,
        _registerListener : function (listener, isOnce, scope, priority) {
            var prevIndex = this._indexOfListener(listener),
            binding;
            if (prevIndex !== -1) { //avoid creating a new Binding for same listener if already added to list
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, scope, priority);
                this._addBinding(binding);
            }
            return binding;
        },
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },
        _indexOfListener : function (listener) {
            var n = this._bindings.length;
            while (n--) {
                if (this._bindings[n]._listener === listener) {
                    return n;
                }
            }
            return -1;
        },
        add : function (listener, scope, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, scope, priority);
        },
        addOnce : function (listener, scope, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, scope, priority);
        },
        remove : function (listener) {
            validateListener(listener, 'remove');
            var i = this._indexOfListener(listener);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },
        getNumListeners : function () {
            return this._bindings.length;
        },
        halt : function () {
            this._shouldPropagate = false;
        },
        dispatch : function (params) {
            if (! this.active) {
                return;
            }
            var paramsArr = Array.prototype.slice.call(arguments),
            bindings = this._bindings.slice(), //clone array in case add/remove items during dispatch
            n = this._bindings.length;
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },
        dispose : function () {
            this.removeAll();
            delete this._bindings;
        },
        toString : function () {
            return '[Signal active: '+ this.active +' numListeners: '+ this.getNumListeners() +']';
        }
    };
    global.signals = signals;
}(window || this));
