///<reference path='../interfaces/IModel.ts'/>
///<reference path='../interfaces/IProxy.ts'/>

module puremvc
{
	"use strict";

	/**
	 * Error message used to indicate that a controller singleton is already constructed when
	 * trying to constructs the class twice.
	 *
	 * @constant
	 */
	const SINGLETON_MSG: string = "Model singleton already constructed!";

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
	export class Model
		implements IModel
	{
		/**
		 * HashTable of <code>IProxy</code> registered with the <code>Model</code>.
		 *
		 * @protected
		 */
		protected _proxyMap: any = null;

		/**
		 * This <code>IModel</code> implementation is a singleton, so you should not call the
		 * constructor directly, but instead call the static singleton Factory method
		 * <code>Model.getInstance()</code>.
		 * 
		 * @throws Error
		 * 		Error if singleton instance has already been constructed.
		 */
		public constructor()
		{
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
		protected initializeModel(): void
		{

		}

		/**
		 * Register an <code>IProxy</code> with the <code>Model</code>.
		 * 
		 * @param proxy
		 *		An <code>IProxy</code> to be held by the <code>Model</code>.
		 */
		public registerProxy(proxy: IProxy): void
		{
			this._proxyMap[proxy.getProxyName()] = proxy;
			proxy.onRegister();
		}

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
		public removeProxy(proxyName: string): IProxy
		{
			var proxy: IProxy = this._proxyMap[proxyName];
			if (proxy)
			{
				delete this._proxyMap[proxyName];
				proxy.onRemove();
			}

			return proxy;
		}

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
		public retrieveProxy(proxyName: string): IProxy
		{
			//Return a strict null when the proxy doesn't exist
			return this._proxyMap[proxyName] || null;
		}

		/**
		 * Check if a Proxy is registered
		 * 
		 * @param proxyName
		 *		The name of the <code>IProxy</code> to verify the existence of its registration.
		 *
		 * @return
		 *		A Proxy is currently registered with the given <code>proxyName</code>.
		 */
		public hasProxy(proxyName: string): boolean
		{
			return this._proxyMap[proxyName] != null;
		}

		/**
		 * singleton instance local reference.
		 *
		 * @protected
		 */
		protected static _instance: IModel;

		/**
		 * <code>Model</code> singleton factory method.
		 * 
		 * @return
		 * 		The singleton instance of <code>Model</code>.
		 */
		public static getInstance(): IModel
		{
			if (!Model._instance)
				Model._instance = new Model();

			return Model._instance;
		}
	}
}