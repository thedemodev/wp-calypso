/**
 * External dependencies
 */
import * as React from 'react';
import { useSelect } from '@wordpress/data';
import 'a8c-fse-common-data-stores';

import DomainPickerModal from '../domain-picker-modal';
import { Button } from '@wordpress/components';
import { Icon, chevronDown } from '@wordpress/icons';
import { useDomainSuggestions, DOMAIN_SUGGESTION_VENDOR } from '../hooks/use-domain-suggestions';
const FLOW_ID = 'gutenboarding';

export default function Element() {
	const [ isDomainModalVisible, setDomainModalVisibility ] = React.useState( false );
	const [ domainSearch, setDomainSearch ] = React.useState( '' );
	const [ domainCategory, setDomainCategory ] = React.useState< string | undefined >( '' );

	const domainSuggestions = useDomainSuggestions( domainSearch, domainCategory );

	const domainCategories = useSelect( ( select ) =>
		select( 'automattic/domains/suggestions' ).getCategories()
	);

	return (
		<>
			<Button
				aria-expanded={ isDomainModalVisible }
				aria-haspopup="menu"
				aria-pressed={ isDomainModalVisible }
				onClick={ () => setDomainModalVisibility( ( s ) => ! s ) }
			>
				<span className="domain-picker-button__label">Open domain picker</span>
				<Icon icon={ chevronDown } size={ 22 } />
			</Button>
			<DomainPickerModal
				analyticsFlowId={ FLOW_ID }
				domainSuggestions={ domainSuggestions }
				domainSearch={ domainSearch }
				domainCategories={ domainCategories }
				domainCategory={ domainCategory }
				onSetDomainCategory={ setDomainCategory }
				onSetDomainSearch={ setDomainSearch }
				isOpen={ isDomainModalVisible }
				showDomainConnectButton
				showDomainCategories
				currentDomain={ undefined }
				onDomainSelect={ () => setDomainModalVisibility( false ) }
				onClose={ () => setDomainModalVisibility( false ) }
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				recordAnalytics={ () => {} }
				railcarId={ 'railcarId' }
				domainSuggestionVendor={ DOMAIN_SUGGESTION_VENDOR }
			/>
		</>
	);
}
