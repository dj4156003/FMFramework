///<reference path='../../interfaces/INotification.ts'/>
///<reference path='../../interfaces/IObserver.ts'/>

module puremvc
{
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
	export class Observer
		implements IObserver
	{
		/**
		 * The notification method of the interested object.
		 * @protected
		 */
		protected _notify: Function = null;

		/**
		 * The notification context of the interested object.
		 * @protected
		 */
		protected _context: any = null;

		/**
		 * Constructs an <code>Observer</code> instance.
		 * 
		 * @param notifyMethod
		 * 		The notification method of the interested object.
		 *
		 * @param notifyContext
		 * 		The notification context of the interested object.
		 */
		public constructor(notifyMethod: Function, notifyContext: any)
		{
			this.setNotifyMethod(notifyMethod);
			this.setNotifyContext(notifyContext);
		}

		/**
		 * Get the notification method.
		 * 
		 * @return
		 * 		The notification (callback) method of the interested object.
		 */
		private getNotifyMethod(): Function
		{
			return this._notify;
		}

		/**
		 * Set the notification method.
		 *
		 * The notification method should take one parameter of type <code>INotification</code>.
		 * 
		 * @param notifyMethod
		 * 		The notification (callback) method of the interested object.
		 */
		public setNotifyMethod(notifyMethod: Function): void
		{
			this._notify = notifyMethod;
		}

		/**
		 * Get the notification context.
		 * 
		 * @return
		 * 		The notification context (<code>this</code>) of the interested object.
		 */
		private getNotifyContext(): any
		{
			return this._context;
		}

		/**
		 * Set the notification context.
		 * 
		 * @param notifyContext
		 * 		The notification context (this) of the interested object.
		 */
		public setNotifyContext(notifyContext: any): void
		{
			this._context = notifyContext;
		}

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
		public notifyObserver(name: string, body: any = null, type: string = null): void
		{
			this.getNotifyMethod().call(this.getNotifyContext(), name, body, type);
		}

		/**
		 * Compare an object to the notification context.
		 *
		 * @param object
		 * 		The object to compare.
		 *
		 * @return
		 * 		The object and the notification context are the same.
		 */
		public compareNotifyContext(object: any): boolean
		{
			return object === this._context;
		}
	}
}