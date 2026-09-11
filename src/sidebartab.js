import Vue from 'vue'
import { translate, translatePlural } from '@nextcloud/l10n'

import SidebarTab from './views/sidebar/SidebarTab'
import TabContent from './views/sidebar/TabContent'

const hasSidebarApi = () => {
	return OCA?.Files?.Sidebar && typeof OCA.Files.Sidebar.Tab === 'function'
}

const registerSidebarTab = (tab) => {
	if (typeof OCA.Files.Sidebar.registerTab === 'function') {
		OCA.Files.Sidebar.registerTab(tab)
		return
	}

	if (typeof OCA.Files.Sidebar.addTab === 'function') {
		OCA.Files.Sidebar.addTab(tab)
	}
}

const createLegacySidebarTab = () => new OCA.Files.Sidebar.Tab('customproperties', SidebarTab)

const createModernSidebarTab = () => {
	// Nextcloud > 21
	Vue.prototype.t = translate
	Vue.prototype.n = translatePlural

	const View = Vue.extend(TabContent)
	let TabInstance = null

	return new OCA.Files.Sidebar.Tab({
		id: 'customproperties',
		name: translate('customproperties', 'Properties'),
		icon: 'icon-info',

		async mount(el, fileInfo, context) {
			if (TabInstance) {
				TabInstance.$destroy()
			}
			TabInstance = new View({
				parent: context,
				data() {
					return {
						fileInfo_: fileInfo,
					}
				},
			})
			await TabInstance.updateFileInfo(fileInfo)
			TabInstance.$mount(el)
		},
		async update(fileInfo) {
			if (TabInstance) {
				await TabInstance.updateFileInfo(fileInfo)
			}
		},
		destroy() {
			if (TabInstance) {
				TabInstance.$destroy()
				TabInstance = null
			}
		},
	})
}

window.addEventListener('DOMContentLoaded', () => {
	if (hasSidebarApi()) {
		let tab

		try {
			tab = createModernSidebarTab()
		} catch (error) {
			tab = createLegacySidebarTab()
		}

		registerSidebarTab(tab)
	}
})
