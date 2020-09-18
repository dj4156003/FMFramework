(function(context){
"use strict";
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/INotifier.ts'/>
///<reference path='../interfaces/IObserver.ts'/>
///<reference path='../interfaces/IMediator.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/INotifier.ts'/>
///<reference path='../../interfaces/INotification.ts'/>
///<reference path='../../interfaces/IObserver.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>IObserver</code> implementation.
     *
     * In PureMVC, the <code>Observer</code> class assumes these responsibilities:
     * <UL>
     * <LI>Encapsulate the notification (callback) method of the interested object.
     * <LI>Encapsulate the notification context (this) of the interested object.
     * <LI>Provide methods for setting the interested object notification method and context.
     * <LI>Provide a method for notifying the interested object.
     *
     * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
     * and TypeScript does not have an inherent event model.
     *
     * The Observer Pattern as implemented within PureMVC exists to support event driven
     * communication between the application and the actors of the MVC triad (Model, View, Controller).
     *
     * An Observer is an object that encapsulates information about an interested object with a
     * notification method that should be called when an </code>INotification</code> is broadcast.
     * The Observer then acts as a proxy for notifying the interested object.
     *
     * Observers can receive <code>Notification</code>s by having their <code>notifyObserver</code>
     * method invoked, passing in an object implementing the <code>INotification</code> interface,
     * such as a subclass of <code>Notification</code>.
     */
    var Observer = /** @class */ (function () {
        /**
         * Constructs an <code>Observer</code> instance.
         *
         * @param notifyMethod
         * 		The notification method of the interested object.
         *
         * @param notifyContext
         * 		The notification context of the interested object.
         */
        function Observer(notifyMethod, notifyContext) {
            /**
             * The notification method of the interested object.
             * @protected
             */
            this._notify = null;
            /**
             * The notification context of the interested object.
             * @protected
             */
            this._context = null;
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
        }
        /**
         * Get the notification method.
         *
         * @return
         * 		The notification (callback) method of the interested object.
         */
        Observer.prototype.getNotifyMethod = function () {
            return this._notify;
        };
        /**
         * Set the notification method.
         *
         * The notification method should take one parameter of type <code>INotification</code>.
         *
         * @param notifyMethod
         * 		The notification (callback) method of the interested object.
         */
        Observer.prototype.setNotifyMethod = function (notifyMethod) {
            this._notify = notifyMethod;
        };
        /**
         * Get the notification context.
         *
         * @return
         * 		The notification context (<code>this</code>) of the interested object.
         */
        Observer.prototype.getNotifyContext = function () {
            return this._context;
        };
        /**
         * Set the notification context.
         *
         * @param notifyContext
         * 		The notification context (this) of the interested object.
         */
        Observer.prototype.setNotifyContext = function (notifyContext) {
            this._context = notifyContext;
        };
        /**
         * Notify the interested object.
         *
         * @param name
         * 		The name of the notification.
         *
         * @param body
         * 		Body data to send with the <code>Notification</code>.
         *
         * @param type
         * 		Type identifier of the <code>Notification</code>.
         */
        Observer.prototype.notifyObserver = function (name, body, type) {
            if (body === void 0) { body = null; }
            if (type === void 0) { type = null; }
            this.getNotifyMethod().call(this.getNotifyContext(), name, body, type);
        };
        /**
         * Compare an object to the notification context.
         *
         * @param object
         * 		The object to compare.
         *
         * @return
         * 		The object and the notification context are the same.
         */
        Observer.prototype.compareNotifyContext = function (object) {
            return object === this._context;
        };
        return Observer;
    }());
    puremvc.Observer = Observer;
})(puremvc || (puremvc = {}));
///<reference path='../interfaces/IView.ts'/>
///<reference path='../interfaces/IObserver.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/IMediator.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * The <code>View</code> class for PureMVC.
     *
     * A singleton <code>IView</code> implementation.
     *
     * In PureMVC, the <code>View</code> class assumes these responsibilities:
     * <UL>
     * <LI>Maintain a cache of <code>IMediator</code> instances.
     * <LI>Provide methods for registering, retrieving, and removing <code>IMediator</code>s.
     * <LI>Notifiying <code>IMediator</code>s when they are registered or removed.
     * <LI>Managing the <code>Observer</code> lists for each <code>INotification</code> in the
     * application.
     * <LI>Providing a method for attaching <code>IObservers</code> to an
     * <code>INotification</code>'s <code>Observer</code> list.
     * <LI>Providing a method for broadcasting an <code>INotification</code>.
     * <LI>Notifying the <code>IObserver</code>s of a given <code>INotification</code> when it
     * broadcasts.
     */
    var View = /** @class */ (function () {
        /**
         * This <code>IView</code> implementation is a singleton, so you should not call the
         * constructor directly, but instead call the static singleton Factory method
         * <code>View.getInstance()</code>.
         *
         * @throws Error
         * 		Throws an error if an instance for this singleton has already been constructed.
         */
        function View() {
            /**
             * Mapping of <code>Mediator</code> names to <code>Mediator</code> instances.
             *
             * @protected
             */
            this._mediatorMap = null;
            /**
             * Mapping of <code>Notification</code> names to <code>Observers</code> lists.
             *
             * @protected
             */
            this._observerMap = null;
            if (View._instance)
                throw Error(View.SINGLETON_MSG);
            View._instance = this;
            this._mediatorMap = {};
            this._observerMap = {};
            this.initializeView();
        }
        /**
         * Initialize the singleton <code>View</code> instance.
         *
         * Called automatically by the constructor. This is the opportunity to initialize the
         * singleton instance in a subclass without overriding the constructor.
         */
        View.prototype.initializeView = function () {
        };
        /**
         * Register an <code>IObserver</code> to be notified of <code>INotifications</code> with a
         * given name.
         *
         * @param notificationName
         * 		The name of the <code>INotifications</code> to notify this <code>IObserver</code>
         * 		of.
         *
         * @param observer
         * 		The <code>IObserver</code> to register.
         */
        View.prototype.registerObserver = function (notificationName, observer) {
            var observers = this._observerMap[notificationName];
            if (observers)
                observers.push(observer);
            else
                this._observerMap[notificationName] = [observer];
        };
        /**
         * Remove a list of <code>Observer</code>s for a given <code>notifyContext</code> from an
         * <code>Observer</code> list for a given <code>INotification</code> name.
         *
         * @param notificationName
         * 		Which <code>IObserver</code> list to remove from.
         *
         * @param notifyContext
         * 		Remove the <code>IObserver</code> with this object as its
         *		<code>notifyContext</code>.
         */
        View.prototype.removeObserver = function (notificationName, notifyContext) {
            //The observer list for the notification under inspection
            var observers = this._observerMap[notificationName];
            //Find the observer for the notifyContext.
            var i = observers.length;
            while (i--) {
                var observer = observers[i];
                if (observer.compareNotifyContext(notifyContext)) {
                    observers.splice(i, 1);
                    break;
                }
            }
            /*
             * Also, when a Notification's Observer list length falls to zero, delete the
             * notification key from the observer map.
             */
            if (observers.length == 0)
                delete this._observerMap[notificationName];
        };
        /**
         * Notify the <code>IObserver</code>s for a particular <code>INotification</code>.
         *
         * All previously attached <code>IObserver</code>s for this <code>INotification</code>'s
         * list are notified and are passed a reference to the <code>INotification</code> in the
         * order in which they were registered.
         *
         * @param notification
         * 		The <code>INotification</code> to notify <code>IObserver</code>s of.
         */
        View.prototype.notifyObservers = function (notification) {
            var notificationName = notification.getName();
            var notificationBody = notification.getBody();
            var notificationType = notification.getType();
            var observersRef /*Array*/ = this._observerMap[notificationName];
            if (observersRef) {
                // Copy the array.
                var observers /*Array*/ = observersRef.slice(0);
                var len /*Number*/ = observers.length;
                for (var i /*Number*/ = 0; i < len; i++) {
                    var observer /*Observer*/ = observers[i];
                    observer.notifyObserver(notificationName, notificationBody, notificationType);
                }
            }
            notification.dispose();
        };
        /**
         * Register an <code>IMediator</code> instance with the <code>View</code>.
         *
         * Registers the <code>IMediator</code> so that it can be retrieved by name, and further
         * interrogates the <code>IMediator</code> for its <code>INotification</code> interests.
         *
         * If the <code>IMediator</code> returns any <code>INotification</code> names to be
         * notified about, an <code>Observer</code> is created to encapsulate the
         * <code>IMediator</code> instance's <code>handleNotification</code> method and register
         * it as an <code>Observer</code> for all <code>INotification</code>s the
         * <code>IMediator</code> is interested in.
         *
         * @param mediator
         * 		A reference to an <code>IMediator</code> implementation instance.
         */
        View.prototype.registerMediator = function (mediator) {
            var name = mediator.getMediatorName();
            //Do not allow re-registration (you must removeMediator first).
            if (this._mediatorMap[name])
                return;
            //Register the Mediator for retrieval by name.
            this._mediatorMap[name] = mediator;
            //Get Notification interests, if any.
            var interests = mediator.listNotificationInterests();
            var len = interests.length;
            if (len > 0) {
                //Create Observer referencing this mediator's handlNotification method.
                var observer = new puremvc.Observer(mediator.handleNotification, mediator);
                //Register Mediator as Observer for its list of Notification interests.
                for (var i = 0; i < len; i++)
                    this.registerObserver(interests[i], observer);
            }
            //Alert the mediator that it has been registered.
            mediator.onRegister();
        };
        /**
         * Retrieve an <code>IMediator</code> from the <code>View</code>.
         *
         * @param mediatorName
         * 		The name of the <code>IMediator</code> instance to retrieve.
         *
         * @return
         * 		The <code>IMediator</code> instance previously registered with the given
         *		<code>mediatorName</code> or an explicit <code>null</code> if it doesn't exists.
         */
        View.prototype.retrieveMediator = function (mediatorName) {
            //Return a strict null when the mediator doesn't exist
            return this._mediatorMap[mediatorName] || null;
        };
        /**
         * Remove an <code>IMediator</code> from the <code>View</code>.
         *
         * @param mediatorName
         * 		Name of the <code>IMediator</code> instance to be removed.
         *
         * @return
         *		The <code>IMediator</code> that was removed from the <code>View</code> or a
         *		strict <code>null</null> if the <code>Mediator</code> didn't exist.
         */
        View.prototype.removeMediator = function (mediatorName) {
            // Retrieve the named mediator
            var mediator = this._mediatorMap[mediatorName];
            if (!mediator)
                return null;
            //Get Notification interests, if any.
            var interests = mediator.listNotificationInterests();
            //For every notification this mediator is interested in...
            var i = interests.length;
            while (i--)
                this.removeObserver(interests[i], mediator);
            // remove the mediator from the map
            delete this._mediatorMap[mediatorName];
            //Alert the mediator that it has been removed
            mediator.onRemove();
            return mediator;
        };
        /**
         * Check if a <code>IMediator</code> is registered or not.
         *
         * @param mediatorName
         * 		The <code>IMediator</code> name to check whether it is registered.
         *
         * @return
         *		A <code>Mediator</code> is registered with the given <code>mediatorName</code>.
         */
        View.prototype.hasMediator = function (mediatorName) {
            return this._mediatorMap[mediatorName] != null;
        };
        /**
         * <code>View</code> singleton Factory method.
         *
         * @return
         *		The singleton instance of <code>View</code>.
         */
        View.getInstance = function () {
            if (!View._instance)
                View._instance = new View();
            return View._instance;
        };
        /**
         * @constant
         * @protected
         */
        View.SINGLETON_MSG = "View singleton already constructed!";
        return View;
    }());
    puremvc.View = View;
})(puremvc || (puremvc = {}));
///<reference path='../interfaces/IController.ts'/>
///<reference path='../interfaces/IView.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../interfaces/ICommand.ts'/>
///<reference path='../patterns/observer/Observer.ts'/>
///<reference path='../core/View.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * Error message used to indicate that a controller singleton is already constructed when
     * trying to constructs the class twice.
     *
     * @protected
     * @constant
     */
    var SINGLETON_MSG = "Controller singleton already constructed!";
    /**
     * The <code>Controller</code> class for PureMVC.
     *
     * A singleton <code>IController</code> implementation.
     *ß
     * In PureMVC, the <code>Controller</code> class follows the 'Command and Controller' strategy,
     * and assumes these responsibilities:
     *
     * <UL>
     * <LI>Remembering which <code>ICommand</code>s are intended to handle which
     * <code>INotification</code>s.
     * <LI>Registering itself as an <code>IObserver</code> with the <code>View</code> for each
     * <code>INotification</code> that it has an <code>ICommand</code> mapping for.
     * <LI>Creating a new instance of the proper <code>ICommand</code> to handle a given
     * <code>INotification</code> when notified by the <code>View</code>.
     * <LI>Calling the <code>ICommand</code>'s <code>execute</code> method, passing in the
     * <code>INotification</code>.
     *
     * Your application must register <code>ICommand</code>s with the <code>Controller</code>.
     *
     * The simplest way is to subclass </code>Facade</code>, and use its
     * <code>initializeController</code> method to add your registrations.
     */
    var Controller = /** @class */ (function () {
        /**
        /**
         * Constructs a <code>Controller</code> instance.
         *
         * This <code>IController</code> implementation is a singleton, so you should not call the
         * constructor directly, but instead call the static singleton Factory method
         * <code>Controller.getInstance()</code>.
         *
         * @throws Error
         * 		Throws an error if an instance for this singleton has already been constructed.
         */
        function Controller() {
            /**
             * Local reference to the <code>View</code> singleton.
             *
             * @protected
             */
            this._view = null;
            /**
             * Mapping of <code>Notification<code> names to <code>Command</code> constructors references.
             *
             * @protected
             */
            this._commandMap = null;
            if (Controller._instance)
                throw Error(SINGLETON_MSG);
            Controller._instance = this;
            this._commandMap = {};
            this.initializeController();
        }
        /**
         * Initialize the singleton <code>Controller</code> instance.
         *
         * Called automatically by the constructor.
         *
         * Note that if you are using a subclass of <code>View</code> in your application, you
         * should <i>also</i> subclass <code>Controller</code> and override the
         * <code>initializeController</code> method in the following way:
         *
         * <pre>
         *		// ensure that the Controller is talking to my IView implementation
         *		initializeController():void
         *		{
         *			this.view = MyView.getInstance();
         *		}
         * </pre>
         *
         * @protected
         */
        Controller.prototype.initializeController = function () {
            this._view = puremvc.View.getInstance();
        };
        /**
         * If an <code>ICommand</code> has previously been registered to handle the given
         * <code>INotification</code>, then it is executed.
         *
         * @param notification
         * 		The <code>INotification</code> the command will receive as parameter.
         */
        Controller.prototype.executeCommand = function (notification) {
            /*
             * Typed any here instead of <code>Function</code> ( won't compile if set to Function
             * because today the compiler consider that <code>Function</code> is not newable and
             * doesn't have a <code>Class</code> type)
             */
            var commandClassRef = this._commandMap[notification.getName()];
            if (commandClassRef) {
                var command = new commandClassRef();
                command.execute(notification);
            }
        };
        /**
         * Register a particular <code>ICommand</code> class as the handler for a particular
         * <code>INotification</code>.
         *
         * If an <code>ICommand</code> has already been registered to handle
         * <code>INotification</code>s with this name, it is no longer used, the new
         * <code>ICommand</code> is used instead.
         *
         * The <code>Observer</code> for the new <code>ICommand</code> is only created if this the
         * first time an <code>ICommand</code> has been registered for this
         * <code>Notification</code> name.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code>.
         *
         * @param commandClassRef
         * 		The constructor of the <code>ICommand</code>.
         */
        Controller.prototype.registerCommand = function (notificationName, commandClassRef) {
            if (!this._commandMap[notificationName])
                this._view && this._view.registerObserver(notificationName, new puremvc.Observer(this.executeCommand, this));
            this._commandMap[notificationName] = commandClassRef;
        };
        /**
         * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
         *
         * @param notificationName
         * 		Name of the <code>Notification</code> to check wheter an <code>ICommand</code> is
         * 		registered for.
         *
         * @return
         * 		An <code>ICommand</code> is currently registered for the given
         * 		<code>notificationName</code>.
         */
        Controller.prototype.hasCommand = function (notificationName) {
            return this._commandMap[notificationName] != null;
        };
        /**
         * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
         * mapping.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code> to remove the <code>ICommand</code>
         * 		mapping for.
         */
        Controller.prototype.removeCommand = function (notificationName) {
            // if the Command is registered...
            if (this.hasCommand(notificationName)) {
                this._view && this._view.removeObserver(notificationName, this);
                delete this._commandMap[notificationName];
            }
        };
        /**
         * <code>Controller</code> singleton Factory method.
         *
         * @return
         * 		The singleton instance of <code>Controller</code>
         */
        Controller.getInstance = function () {
            if (!Controller._instance)
                Controller._instance = new Controller();
            return Controller._instance;
        };
        return Controller;
    }());
    puremvc.Controller = Controller;
})(puremvc || (puremvc = {}));
///<reference path='../interfaces/INotifier.ts'/>
///<reference path='../interfaces/IProxy.ts'/>
///<reference path='../interfaces/IModel.ts'/>
///<reference path='../interfaces/IProxy.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * Error message used to indicate that a controller singleton is already constructed when
     * trying to constructs the class twice.
     *
     * @constant
     */
    var SINGLETON_MSG = "Model singleton already constructed!";
    /**
     * The <code>Model</code> class for PureMVC.
     *
     * A singleton <code>IModel</code> implementation.
     *
     * In PureMVC, the <code>IModel</code> class provides access to model objects
     * <code>Proxie</code>s by named lookup.
     *
     * The <code>Model</code> assumes these responsibilities:
     * <UL>
     * <LI>Maintain a cache of <code>IProxy</code> instances.
     * <LI>Provide methods for registering, retrieving, and removing <code>Proxy</code> instances.
     *
     * Your application must register <code>IProxy</code> instances with the <code>Model</code>.
     * Typically, you use an <code>ICommand</code> to create and register <code>Proxy</code> instances
     * once the <code>Facade</code> has initialized the Core actors.
     */
    var Model = /** @class */ (function () {
        /**
         * This <code>IModel</code> implementation is a singleton, so you should not call the
         * constructor directly, but instead call the static singleton Factory method
         * <code>Model.getInstance()</code>.
         *
         * @throws Error
         * 		Error if singleton instance has already been constructed.
         */
        function Model() {
            /**
             * HashTable of <code>IProxy</code> registered with the <code>Model</code>.
             *
             * @protected
             */
            this._proxyMap = null;
            if (Model._instance)
                throw Error(SINGLETON_MSG);
            Model._instance = this;
            this._proxyMap = {};
            this.initializeModel();
        }
        /**
         * Initialize the singleton <code>Model</code> instance.
         *
         * Called automatically by the constructor, this is the opportunity to initialize the
         * singleton instance in a subclass without overriding the constructor.
         *
         * @protected
         */
        Model.prototype.initializeModel = function () {
        };
        /**
         * Register an <code>IProxy</code> with the <code>Model</code>.
         *
         * @param proxy
         *		An <code>IProxy</code> to be held by the <code>Model</code>.
         */
        Model.prototype.registerProxy = function (proxy) {
            this._proxyMap[proxy.getProxyName()] = proxy;
            proxy.onRegister();
        };
        /**
         * Remove an <code>IProxy</code> from the <code>Model</code>.
         *
         * @param proxyName
         *		The name of the <code>Proxy</code> instance to be removed.
         *
         * @return
         *		The <code>IProxy</code> that was removed from the <code>Model</code> or an
         *		explicit <code>null</null> if the <code>IProxy</code> didn't exist.
         */
        Model.prototype.removeProxy = function (proxyName) {
            var proxy = this._proxyMap[proxyName];
            if (proxy) {
                delete this._proxyMap[proxyName];
                proxy.onRemove();
            }
            return proxy;
        };
        /**
         * Retrieve an <code>IProxy</code> from the <code>Model</code>.
         *
         * @param proxyName
         *		 The <code>IProxy</code> name to retrieve from the <code>Model</code>.
         *
         * @return
         *		The <code>IProxy</code> instance previously registered with the given
         *		<code>proxyName</code> or an explicit <code>null</code> if it doesn't exists.
         */
        Model.prototype.retrieveProxy = function (proxyName) {
            //Return a strict null when the proxy doesn't exist
            return this._proxyMap[proxyName] || null;
        };
        /**
         * Check if a Proxy is registered
         *
         * @param proxyName
         *		The name of the <code>IProxy</code> to verify the existence of its registration.
         *
         * @return
         *		A Proxy is currently registered with the given <code>proxyName</code>.
         */
        Model.prototype.hasProxy = function (proxyName) {
            return this._proxyMap[proxyName] != null;
        };
        /**
         * <code>Model</code> singleton factory method.
         *
         * @return
         * 		The singleton instance of <code>Model</code>.
         */
        Model.getInstance = function () {
            if (!Model._instance)
                Model._instance = new Model();
            return Model._instance;
        };
        return Model;
    }());
    puremvc.Model = Model;
})(puremvc || (puremvc = {}));
///<reference path='../interfaces/INotifier.ts'/>
///<reference path='../interfaces/IProxy.ts'/>
///<reference path='../interfaces/IMediator.ts'/>
///<reference path='../interfaces/INotification.ts'/>
///<reference path='../../interfaces/INotification.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>INotification</code> implementation.
     *
     * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
     * and TypeScript does not have an inherent event model.
     *
     * The Observer pattern as implemented within PureMVC exists to support event-driven
     * communication between the application and the actors of the MVC triad (Model, View and
     * Controller).
     *
     * Notifications are not meant to be a replacement for Events in Javascript.
     * Generally, <code>IMediator</code> implementors place event listeners on their view components,
     * which they then handle in the usual way. This may lead to the broadcast of
     * <code>INotification</code>s to trigger <code>ICommand</code>s or to communicate with other
     * <code>IMediators</code>. <code>IProxy</code> and <code>ICommand</code> instances communicate
     * with each other and <code>IMediator</code>s by broadcasting <code>INotification</code>s.
     *
     * A key difference between JavaScript <code>Event</code>s and PureMVC
     * <code>INotification</code>s is that <code>Event</code>s follow the 'Chain of Responsibility'
     * pattern, 'bubbling' up the display hierarchy until some parent component handles the
     * <code>Event</code>, while PureMVC <code>INotification</code>s follow a 'Publish/Subscribe'
     * pattern. PureMVC classes need not be related to each other in a parent/child relationship in
     * order to communicate with one another using <code>INotification</code>s.
     */
    var Notification = /** @class */ (function () {
        /**
         * Constructs a <code>Notification</code> instance.
         *
         * @param name
         * 		The name of the notification.
         *
         * @param body
         * 		Body data to send with the <code>Notification</code>.
         *
         * @param type
         * 		Type identifier of the <code>Notification</code>.
         */
        function Notification(name, body, type) {
            if (body === void 0) { body = null; }
            if (type === void 0) { type = null; }
            /**
             * The name of the <code>Notification</code>.
             *
             * @protected
             */
            this._name = null;
            /**
             * The body data to send with the <code>Notification</code>.
             *
             * @protected
             */
            this._body = null;
            /**
             * The type identifier of the <code>Notification</code>.
             *
             * @protected
             */
            this._type = null;
            this._released = false;
            this._name = name;
            this._body = body;
            this._type = type;
        }
        Notification.allocate = function (name, body, type) {
            if (body === void 0) { body = null; }
            if (type === void 0) { type = null; }
            var notification = null;
            if (this._notificationPool.length > 0) {
                notification = this._notificationPool.pop();
                notification._name = name;
                notification._body = body;
                notification._type = type;
            }
            else {
                notification = new Notification(name, body, type);
            }
            notification._released = false;
            return notification;
        };
        /**
         * Get the name of the <code>Notification</code> instance.
         *
         * @return
         *		The name of the <code>Notification</code> instance.
         */
        Notification.prototype.getName = function () {
            return this._name;
        };
        /**
         * Set the body of the <code>Notification</code> instance.
         *
         * @param body
         * 		The body of the <code>Notification</code> instance.
         */
        Notification.prototype.setBody = function (body) {
            this._body = body;
        };
        /**
         * Get the body of the <code>Notification</code> instance.
         *
         * @return
         *		The body object of the <code>Notification</code> instance.
         */
        Notification.prototype.getBody = function () {
            return this._body;
        };
        /**
         * Set the type of the <code>Notification</code> instance.
         *
         * @param type
         * 		The type of the <code>Notification</code> instance.
         */
        Notification.prototype.setType = function (type) {
            this._type = type;
        };
        /**
         * Get the type of the <code>Notification</code> instance.
         *
         * @return
         *		The type of the <code>Notification</code> instance.
         */
        Notification.prototype.getType = function () {
            return this._type;
        };
        /**
         * Get a textual representation of the <code>Notification</code> instance.
         *
         * @return
         * 		The textual representation of the <code>Notification</code>	instance.
         */
        Notification.prototype.toString = function () {
            var msg = "Notification Name: " + this.getName();
            msg += "\nBody:" + ((this.getBody() == null) ? "null" : this.getBody().toString());
            msg += "\nType:" + ((this.getType() == null) ? "null" : this.getType());
            return msg;
        };
        /**
         * Clean notification resources.
         */
        Notification.prototype.dispose = function () {
            if (!this._released) {
                this._released = true;
                this._name = null;
                this._body = null;
                this._type = null;
                var pool = Notification._notificationPool;
                pool[pool.length] = this;
            }
        };
        Notification._notificationPool = [];
        return Notification;
    }());
    puremvc.Notification = Notification;
})(puremvc || (puremvc = {}));
///<reference path='../../interfaces/IFacade.ts'/>
///<reference path='../../interfaces/IModel.ts'/>
///<reference path='../../interfaces/IView.ts'/>
///<reference path='../../interfaces/IController.ts'/>
///<reference path='../../interfaces/IProxy.ts'/>
///<reference path='../../interfaces/IMediator.ts'/>
///<reference path='../../interfaces/INotification.ts'/>
///<reference path='../../core/Controller.ts'/>
///<reference path='../../core/Model.ts'/>
///<reference path='../../core/View.ts'/>
///<reference path='../../patterns/observer/Notification.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base singleton <code>IFacade</code> implementation.
     *
     * In PureMVC, the <code>Facade</code> class assumes these responsibilities:
     *
     * <UL>
     * <LI>Initializing the <code>Model</code>, <code>View</code> and <code>Controller</code>
     * singletons.
     * <LI>Providing all the methods defined by the <code>IModel</code>, <code>IView</code>, &
     * <code>IController</code> interfaces.
     * <LI>Providing the ability to override the specific <code>Model</code>, <code>View</code> and
     * <code>Controller</code> singletons created.
     * <LI>Providing a single point of contact to the application for registering
     * <code>Commands</code> and notifying <code>Observer</code>s.
     *
     * This <code>Facade</code> implementation is a singleton and cannot be instantiated directly,
     * but instead calls the static singleton factory method <code>Facade.getInstance()</code>.
     */
    var Facade = /** @class */ (function () {
        /**
         * Constructs a <code>Controller</code> instance.
         *
         * This <code>IFacade</code> implementation is a singleton, so you should not call the
         * constructor directly, but instead call the static singleton Factory method
         * <code>Facade.getInstance()</code>.
         *
         * @throws Error
         *		Throws an error if an instance of this singleton has already been constructed.
         */
        function Facade() {
            /**
             * Local reference to the <code>Model</code> singleton.
             *
             * @protected
             */
            this._model = null;
            /**
             * Local reference to the <code>View</code> singleton.
             *
             * @protected
             */
            this._view = null;
            /**
             * Local reference to the <code>Controller</code> singleton.
             *
             * @protected
             */
            this._controller = null;
            if (Facade._instance)
                throw Error(Facade.SINGLETON_MSG);
            Facade._instance = this;
            this.initializeFacade();
        }
        /**
         * Called automatically by the constructor.
         * Initialize the singleton <code>Facade</code> instance.
         *
         * Override in your subclass to do any subclass specific initializations. Be sure to
         * extend the <code>Facade</code> with the methods and properties on your implementation
         * and call <code>Facade.initializeFacade()</code>.
         *
         * @protected
         */
        Facade.prototype.initializeFacade = function () {
            this.initializeModel();
            this.initializeController();
            this.initializeView();
        };
        /**
         * Initialize the <code>Model</code>.
         *
         * Called by the <code>initializeFacade</code> method. Override this method in your
         * subclass of <code>Facade</code> if one or both of the following are true:
         *
         * <UL>
         * <LI> You wish to initialize a different <code>IModel</code>.
         * <LI> You have <code>Proxy</code>s to register with the <code>Model</code> that do not
         * retrieve a reference to the <code>Facade</code> at construction time.
         *
         * If you don't want to initialize a different <code>IModel</code>, call
         * <code>super.initializeModel()</code> at the beginning of your method, then register
         * <code>Proxy</code>s.
         *
         * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
         * <code>Command</code> to create and register <code>Proxy</code>s with the
         * <code>Model</code>, since <code>Proxy</code>s with mutable data will likely need to send
         * <code>INotification</code>s and thus will likely want to fetch a reference to the
         * <code>Facade</code> during their construction.
         *
         * @protected
         */
        Facade.prototype.initializeModel = function () {
            if (!this._model)
                this._model = puremvc.Model.getInstance();
        };
        /**
         * Initialize the <code>Controller</code>.
         *
         * Called by the <code>initializeFacade</code> method. Override this method in your
         * subclass of <code>Facade</code> if one or both of the following are true:
         *
         * <UL>
         * <LI>You wish to initialize a different <code>IController</code>.
         * <LI>You have <code>ICommand</code>s to register with the <code>Controller</code> at
         * startup.
         *
         * If you don't want to initialize a different <code>IController</code>, call
         * <code>super.initializeController()</code> at the beginning of your method, then register
         * <code>Command</code>s.
         *
         * @protected
         */
        Facade.prototype.initializeController = function () {
            if (!this._controller)
                this._controller = puremvc.Controller.getInstance();
        };
        /**
         * Initialize the <code>View</code>.
         *
         * Called by the <code>initializeFacade</code> method. Override this method in your
         * subclass of <code>Facade</code> if one or both of the following are true:
         * <UL>
         * <LI> You wish to initialize a different <code>IView</code>.
         * <LI> You have <code>Observers</code> to register with the <code>View</code>
         *
         * If you don't want to initialize a different <code>IView</code>, call
         * <code>super.initializeView()</code> at the beginning of your method, then register
         * <code>IMediator</code> instances.
         *
         * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
         * <code>Command</code> to create and register <code>Mediator</code>s with the
         * <code>View</code>, since <code>IMediator</code> instances will need to send
         * <code>INotification</code>s and thus will likely want to fetch a reference to the
         * <code>Facade</code> during their construction.
         *
         * @protected
         */
        Facade.prototype.initializeView = function () {
            if (!this._view)
                this._view = puremvc.View.getInstance();
        };
        /**
         * Register an <code>ICommand</code> with the <code>IController</code> associating it to a
         * <code>INotification</code> name.
         *
         * @param notificationName
         *		The name of the <code>INotification</code> to associate the <code>ICommand</code>
         *		with.
         
         * @param commandClassRef
         * 		A reference to the constructor of the <code>ICommand</code>.
         */
        Facade.prototype.registerCommand = function (notificationName, commandClassRef) {
            this._controller.registerCommand(notificationName, commandClassRef);
        };
        /**
         * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
         * mapping from the <code>Controller</code>.
         *
         * @param notificationName
         *		The name of the <code>INotification</code> to remove the <code>ICommand</code>
         *		mapping for.
         */
        Facade.prototype.removeCommand = function (notificationName) {
            this._controller.removeCommand(notificationName);
        };
        /**
         * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
         *
         * @param notificationName
         * 		The name of the <code>INotification</code> to verify for the existence of an
         * 		<code>ICommand</code> mapping for.
         *
         * @return
         * 		A <code>Command</code> is currently registered for the given
         *		<code>notificationName</code>.
         */
        Facade.prototype.hasCommand = function (notificationName) {
            return this._controller.hasCommand(notificationName);
        };
        /**
         * Register an <code>IProxy</code> with the <code>Model</code> by name.
         *
         * @param proxy
         *		The <code>IProxy</code> to be registered with the <code>Model</code>.
         */
        Facade.prototype.registerProxy = function (proxy) {
            this._model.registerProxy(proxy);
        };
        /**
         * Retrieve an <code>IProxy</code> from the <code>Model</code> by name.
         *
         * @param proxyName
         * 		The name of the <code>IProxy</code> to be retrieved.
         *
         * @return
         * 		The <code>IProxy</code> previously registered with the given
         *		<code>proxyName</code>.
         */
        Facade.prototype.retrieveProxy = function (proxyName) {
            return this._model.retrieveProxy(proxyName);
        };
        /**
         * Remove an <code>IProxy</code> from the <code>Model</code> by name.
         *
         * @param proxyName
         *		The <code>IProxy</code> to remove from the <code>Model</code>.
         *
         * @return
         *		The <code>IProxy</code> that was removed from the <code>Model</code>
         */
        Facade.prototype.removeProxy = function (proxyName) {
            var proxy;
            if (this._model)
                proxy = this._model.removeProxy(proxyName);
            return proxy;
        };
        /**
         * Check if a <code>Proxy</code> is registered.
         *
         * @param proxyName
         * 		The <code>IProxy</code> to verify the existence of a registration with the
         *		<code>IModel</code>.
         *
         * @return
         * 		A <code>Proxy</code> is currently registered with the given	<code>proxyName</code>.
         */
        Facade.prototype.hasProxy = function (proxyName) {
            return this._model.hasProxy(proxyName);
        };
        /**
         * Register a <code>IMediator</code> with the <code>IView</code>.
         *
         * @param mediator
                A reference to the <code>IMediator</code>.
         */
        Facade.prototype.registerMediator = function (mediator) {
            if (this._view)
                this._view.registerMediator(mediator);
        };
        /**
         * Retrieve an <code>IMediator</code> from the <code>IView</code>.
         *
         * @param mediatorName
         * 		The name of the registered <code>Mediator</code> to retrieve.
         *
         * @return
         *		The <code>IMediator</code> previously registered with the given
         *		<code>mediatorName</code>.
         */
        Facade.prototype.retrieveMediator = function (mediatorName) {
            return this._view.retrieveMediator(mediatorName);
        };
        /**
         * Remove an <code>IMediator</code> from the <code>IView</code>.
         *
         * @param mediatorName
         * 		Name of the <code>IMediator</code> to be removed.
         *
         * @return
         *		The <code>IMediator</code> that was removed from the <code>IView</code>
         */
        Facade.prototype.removeMediator = function (mediatorName) {
            var mediator;
            if (this._view)
                mediator = this._view.removeMediator(mediatorName);
            return mediator;
        };
        /**
         * Check if a <code>Mediator</code> is registered or not
         *
         * @param mediatorName
         * 		The name of the <code>IMediator</code> to verify the existence of a registration
         *		for.
         *
         * @return
         * 		An <code>IMediator</code> is registered with the given <code>mediatorName</code>.
         */
        Facade.prototype.hasMediator = function (mediatorName) {
            return this._view.hasMediator(mediatorName);
        };
        /**
         * Notify the <code>IObservers</code> for a particular <code>INotification</code>.
         *
         * This method is left public mostly for backward compatibility, and to allow you to
         * send custom notification classes using the <code>Facade</code>.
         *
         *
         * Usually you should just call <code>sendNotification</code> and pass the parameters,
         * never having to construct the <code>INotification</code> yourself.
         *
         * @param notification
         * 		The <code>INotification</code> to have the <code>IView</code> notify
         *		<code>IObserver</code>s	of.
         */
        Facade.prototype.notifyObservers = function (notification) {
            if (this._view)
                this._view.notifyObservers(notification);
        };
        /**
         * Create and send an <code>INotification</code>.
         *
         * Keeps us from having to construct new notification instances in our implementation code.
         *
         * @param name
         *		The name of the notification to send.
         *
         * @param body
         *		The body of the notification to send.
         *
         * @param type
         *		The type of the notification to send.
         */
        Facade.prototype.sendNotification = function (name, body, type) {
            if (body === void 0) { body = null; }
            if (type === void 0) { type = null; }
            this.notifyObservers(puremvc.Notification.allocate(name, body, type));
        };
        /**
         * Facade singleton factory method.
         *
         * @return
         * 		The singleton instance of <code>Facade</code>.
         */
        Facade.getInstance = function () {
            if (!Facade._instance)
                Facade._instance = new Facade();
            return Facade._instance;
        };
        /**
         * @constant
         * @protected
         */
        Facade.SINGLETON_MSG = "Facade singleton already constructed!";
        return Facade;
    }());
    puremvc.Facade = Facade;
})(puremvc || (puremvc = {}));
///<reference path='../../interfaces/INotifier.ts'/>
///<reference path='../../interfaces/IFacade.ts'/>
///<reference path='../../patterns/facade/Facade.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>INotifier</code> implementation.
     *
     * <code>MacroCommand</code>, <code>SimpleCommand</code>, <code>Mediator</code> and
     * <code>Proxy</code> all have a need to send <code>Notifications</code>.
     *
     * The <code>INotifier</code> interface provides a common method called
     * <code>sendNotification</code> that relieves implementation code of the necessity to actually
     * construct <code>Notification</code>s.
     *
     * The <code>INotifier</code> interface, which all of the above mentioned classes extend,
     * provides an initialized reference to the <code>Facade</code> singleton, which is required by
     * the convenience method <code>sendNotification</code>	for sending <code>Notifications</code>,
     * but it also eases implementation as these classes have frequent <code>Facade</code>
     * interactions and usually require access to the facade anyway.
     */
    var Notifier = /** @class */ (function () {
        /**
         * Constructs a <code>Notifier</code> instance.
         */
        function Notifier() {
            /**
             * Local reference to the singleton <code>Facade</code>.
             *
             * @protected
             */
            this._facade = null;
            this._facade = puremvc.Facade.getInstance();
        }
        /**
         * Create and send a <code>Notification</code>.
         *
         * Keeps us from having to construct new <code>Notification</code> instances in our
         * implementation code.
         *
         * @param name
         * 		The name of the notification to send.
         *
         * @param body
         * 		The body of the notification.
         *
         * @param type
         * 		The type of the notification.
         */
        Notifier.prototype.sendNotification = function (name, body, type) {
            if (body === void 0) { body = null; }
            if (type === void 0) { type = null; }
            this._facade.sendNotification(name, body, type);
        };
        return Notifier;
    }());
    puremvc.Notifier = Notifier;
})(puremvc || (puremvc = {}));
///<reference path='../../interfaces/ICommand.ts'/>
///<reference path='../../interfaces/INotifier.ts'/>
///<reference path='../../interfaces/INotification.ts'/>
///<reference path='../../patterns/observer/Notifier.ts'/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>ICommand</code> implementation that executes other <code>ICommand</code>s.
     *
     * A <code>MacroCommand</code> maintains an list of <code>ICommand</code> constructor references
     * called <i>SubCommand</i>s.
     *
     * When <code>execute</code> is called, the <code>MacroCommand</code> instantiates and calls
     * <code>execute</code> on each of its <i>SubCommands</i> turn. Each <i>SubCommand</i> will be
     * passed a reference to the original <code>INotification</code> that was passed to the
     * <code>MacroCommand</code>'s <code>execute</code> method.
     *
     * Unlike <code>SimpleCommand</code>, your subclass should not override <code>execute</code>,
     * but instead, should override the <code>initializeMacroCommand</code> method, calling
     * <code>addSubCommand</code> once for each <i>SubCommand</i> to be executed.
     */
    var MacroCommand = /** @class */ (function (_super) {
        __extends(MacroCommand, _super);
        /**
         * Constructs a <code>MacroCommand</code> instance.
         *
         * You should not need to define a constructor in your subclasses, instead, override the
         * <code>initializeMacroCommand</code> method.
         *
         * If your subclass does define a constructor, be  sure to call <code>super()</code>.
         */
        function MacroCommand() {
            var _this = _super.call(this) || this;
            /**
             * An array of <code>ICommand</code>s.
             *
             * @protected
             */
            _this._subCommands = null;
            _this._subCommands = [];
            _this.initializeMacroCommand();
            return _this;
        }
        /**
         * Initialize the <code>MacroCommand</code>.
         *
         * In your subclass, override this method to  initialize the <code>MacroCommand</code>'s
         * <i>SubCommand</i> list with <code>ICommand</code> class references like this:
         *
         * <pre>
         *		// Initialize MyMacroCommand
         *		initializeMacroCommand():void
         *		{
         *			this.addSubCommand( FirstCommand );
         *			this.addSubCommand( SecondCommand );
         *			this.addSubCommand( ThirdCommand );
         *		}
         * </pre>
         *
         * Note that <i>subCommand</i>s may be any <code>ICommand</code> implementor so
         * <code>MacroCommand</code>s or <code>SimpleCommand</code>s are both acceptable.
         */
        MacroCommand.prototype.initializeMacroCommand = function () {
        };
        /**
         * Add an entry to the <i>subCommands</i> list.
         *
         * The <i>subCommands</i> will be called in First In/First Out (FIFO) order.
         *
         * @param commandClassRef
         *		A reference to the constructor of the <code>ICommand</code>.
         */
        MacroCommand.prototype.addSubCommand = function (commandClassRef) {
            this._subCommands.push(commandClassRef);
        };
        /**
         * Execute this <code>MacroCommand</code>'s <i>SubCommands</i>.
         *
         * The <i>SubCommands</i> will be called in First In/First Out (FIFO)
         * order.
         *
         * @param notification
         *		The <code>INotification</code> object to be passed to each <i>SubCommand</i> of
         *		the list.
         *
         * @final
         */
        MacroCommand.prototype.execute = function (notification) {
            var subCommands = this._subCommands.slice(0);
            var len = this._subCommands.length;
            for (var i = 0; i < len; i++) {
                /*
                 * Typed any here instead of <code>Function</code> ( won't compile if set to Function
                 * because today the compiler consider that <code>Function</code> is not newable and
                 * doesn't have a <code>Class</code> type)
                 */
                var commandClassRef = subCommands[i];
                var commandInstance = new commandClassRef();
                commandInstance.execute(notification);
            }
            this._subCommands.splice(0);
        };
        return MacroCommand;
    }(puremvc.Notifier));
    puremvc.MacroCommand = MacroCommand;
})(puremvc || (puremvc = {}));
///<reference path='../../interfaces/ICommand.ts'/>
///<reference path='../../interfaces/INotifier.ts'/>
///<reference path='../../interfaces/INotification.ts'/>
///<reference path='../../patterns/observer/Notifier.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>ICommand</code> implementation.
     *
     * Your subclass should override the <code>execute</code> method where your business logic will
     * handle the <code>INotification</code>.
     */
    var SimpleCommand = /** @class */ (function (_super) {
        __extends(SimpleCommand, _super);
        function SimpleCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Fulfill the use-case initiated by the given <code>INotification</code>.
         *
         * In the Command Pattern, an application use-case typically begins with some user action,
         * which results in an <code>INotification</code> being broadcast, which is handled by
         * business logic in the <code>execute</code> method of an <code>ICommand</code>.
         *
         * @param notification
         * 		The <code>INotification</code> to handle.
         */
        SimpleCommand.prototype.execute = function (notification) {
        };
        return SimpleCommand;
    }(puremvc.Notifier));
    puremvc.SimpleCommand = SimpleCommand;
})(puremvc || (puremvc = {}));
///<reference path='../../interfaces/IMediator.ts'/>
///<reference path='../../interfaces/INotifier.ts'/>
///<reference path='../../patterns/observer/Notifier.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>IMediator</code> implementation.
     *
     * Typically, a <code>Mediator</code> will be written to serve one specific control or group
     * controls and so, will not have a need to be dynamically named.
     */
    var Mediator = /** @class */ (function (_super) {
        __extends(Mediator, _super);
        /**
         * Constructs a <code>Mediator</code> instance.
         *
         * @param mediatorName
         * 		The name of the <code>Mediator</code>.
         *
         * @param viewComponent
         * 		The view component handled by this <code>Mediator</code>.
         */
        function Mediator(mediatorName, viewComponent) {
            if (viewComponent === void 0) { viewComponent = null; }
            var _this = _super.call(this) || this;
            /**
             * The name of the <code>Mediator</code>.
             *
             * @protected
             */
            _this._mediatorName = null;
            /**
             * The <code>Mediator</code>'s view component.
             *
             * @protected
             */
            _this._viewComponent = null;
            _this._mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
            _this._viewComponent = viewComponent;
            return _this;
        }
        /**
         * Get the <code>Mediator</code> instance name.
         *
         * @return
         * 		The <code>Mediator</code> instance name
         */
        Mediator.prototype.getMediatorName = function () {
            return this._mediatorName;
        };
        /**
         * Get the <code>Mediator</code>'s view component.
         *
         * Additionally, an implicit getter will usually be defined in the subclass that casts the
         * view object to a type, like this:
         *
         * <code>
         *		getMenu():Menu
         *		{
         *			return <Menu> this.viewComponent;
         *		}
         * </code>
         *
         * @return
         * 		The <code>Mediator</code>'s default view component.
         */
        Mediator.prototype.getViewComponent = function () {
            return this._viewComponent;
        };
        /**
         * Set the <code>IMediator</code>'s view component.
         *
         * @param viewComponent
         * 		The default view component to set for this <code>Mediator</code>.
         */
        Mediator.prototype.setViewComponent = function (viewComponent) {
            this._viewComponent = viewComponent;
        };
        /**
         * List the <code>INotification</code> names this <code>IMediator</code> is interested in
         * being notified of.
         *
         * @return
         * 		The list of notifications names in which is interested the <code>Mediator</code>.
         */
        Mediator.prototype.listNotificationInterests = function () {
            return [];
        };
        /**
         * Handle <code>INotification</code>s.
         *
         *
         * Typically this will be handled in a switch statement, with one 'case' entry per
         * <code>INotification</code> the <code>Mediator</code> is interested in.
         *
        * @param name
         * 		The name of the notification.
         *
         * @param body
         * 		Body data to send with the <code>Notification</code>.
         *
         * @param type
         * 		Type identifier of the <code>Notification</code>.
         */
        Mediator.prototype.handleNotification = function (name, body, type) {
        };
        /**
         * Called by the View when the Mediator is registered. This method has to be overridden
         * by the subclass to know when the instance is registered.
         */
        Mediator.prototype.onRegister = function () {
        };
        /**
         * Called by the View when the Mediator is removed. This method has to be overridden
         * by the subclass to know when the instance is removed.
         */
        Mediator.prototype.onRemove = function () {
        };
        /**
         * Default name of the <code>Mediator</code>.
         *
         * @constant
         */
        Mediator.NAME = 'Mediator';
        return Mediator;
    }(puremvc.Notifier));
    puremvc.Mediator = Mediator;
})(puremvc || (puremvc = {}));
///<reference path='../../interfaces/IProxy.ts'/>
///<reference path='../../interfaces/INotifier.ts'/>
///<reference path='../../patterns/observer/Notifier.ts'/>
var puremvc;
(function (puremvc) {
    "use strict";
    /**
     * A base <code>IProxy</code> implementation.
     *
     * In PureMVC, <code>IProxy</code> implementors assume these responsibilities:
     * <UL>
     * <LI>Implement a common method which returns the name of the Proxy.
     * <LI>Provide methods for setting and getting the data object.
     *
     * Additionally, <code>IProxy</code>s typically:
     * <UL>
     * <LI>Maintain references to one or more pieces of model data.
     * <LI>Provide methods for manipulating that data.
     * <LI>Generate <code>INotifications</code> when their model data changes.
     * <LI>Expose their name as a <code>constant</code> called <code>NAME</code>, if they are not
     * instantiated multiple times.
     * <LI>Encapsulate interaction with local or remote services used to fetch and persist model
     * data.
     */
    var Proxy = /** @class */ (function (_super) {
        __extends(Proxy, _super);
        // /**
        //  * The name of the <code>Proxy</code>.
        //  *
        //  * @protected
        //  */
        // protected _data: any = null;
        /**
         * Constructs a <code>Proxy</code> instance.
         *
         * @param proxyName
         * 		The name of the <code>Proxy</code> instance.
         *
         * @param data
         * 		An initial data object to be held by the <code>Proxy</code>.
         */
        function Proxy(proxyName /*, data: any = null*/) {
            var _this = _super.call(this) || this;
            /**
             * The data object controlled by the <code>Proxy</code>.
             *
             * @protected
             */
            _this._proxyName = null;
            _this._proxyName = (proxyName != null) ? proxyName : Proxy.NAME;
            return _this;
            // if (data != null)
            // 	this.setData(data);
        }
        /**
         * Get the name of the <code>Proxy></code> instance.
         *
         * @return
         * 		The name of the <code>Proxy></code> instance.
         */
        Proxy.prototype.getProxyName = function () {
            return this._proxyName;
        };
        // /**
        //  * Set the data of the <code>Proxy></code> instance.
        //  *
        //  * @param data
        //  * 		The data to set for the <code>Proxy></code> instance.
        //  */
        // public setData(data: any): void
        // {
        // 	this._data = data;
        // }
        // /**
        //  * Get the data of the <code>Proxy></code> instance.
        //  *
        //  * @return
        //  * 		The data held in the <code>Proxy</code> instance.
        //  */
        // public getData(): any
        // {
        // 	return this._data;
        // }
        /**
         * Called by the Model when the <code>Proxy</code> is registered. This method has to be
         * overridden by the subclass to know when the instance is registered.
         */
        Proxy.prototype.onRegister = function () {
        };
        /**
         * Called by the Model when the <code>Proxy</code> is removed. This method has to be
         * overridden by the subclass to know when the instance is removed.
         */
        Proxy.prototype.onRemove = function () {
        };
        /**
         * The default name of the <code>Proxy</code>
         *
         * @type
         * @constant
         */
        Proxy.NAME = "Proxy";
        return Proxy;
    }(puremvc.Notifier));
    puremvc.Proxy = Proxy;
})(puremvc || (puremvc = {}));

context.module[context.moduleName] = puremvc;
})((function(){
var m;
var mName;
if (typeof window !== 'undefined' && window)
{
m = window;
mName = 'puremvc';
}
else if (typeof module !== 'undefined' && module)
{
m = module;
mName = 'exports';
}
else
{
m = {};
mName = 'puremvc';
}
return {"module":m, "moduleName":mName};
})());