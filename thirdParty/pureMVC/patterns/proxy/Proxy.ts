///<reference path='../../interfaces/IProxy.ts'/>
///<reference path='../../interfaces/INotifier.ts'/>

///<reference path='../../patterns/observer/Notifier.ts'/>

module puremvc
{
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
	export class Proxy
		extends Notifier
		implements IProxy, INotifier
	{
		/**
		 * The data object controlled by the <code>Proxy</code>.
		 *
		 * @protected
		 */
		protected _proxyName: string = null;

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
		public constructor(proxyName: string/*, data: any = null*/)
		{
			super();

			this._proxyName = (proxyName != null) ? proxyName : Proxy.NAME;

			// if (data != null)
			// 	this.setData(data);
		}

		/**
		 * Get the name of the <code>Proxy></code> instance.
		 *
		 * @return
		 * 		The name of the <code>Proxy></code> instance.
		 */
		public getProxyName(): string
		{
			return this._proxyName;
		}

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
		public onRegister(): void
		{

		}

		/**
		 * Called by the Model when the <code>Proxy</code> is removed. This method has to be
		 * overridden by the subclass to know when the instance is removed.
		 */
		public onRemove(): void
		{

		}

		/**
		 * The default name of the <code>Proxy</code>
		 * 
		 * @type
		 * @constant
		 */
		private static NAME: string = "Proxy";
	}
}