/**
 * External dependencies
 */
import React from 'react';
import { sprintf, __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../../components/button';
import {
	useLineItems,
	useEvents,
	renderDisplayValueMarkdown,
	useTransactionStatus,
	usePaymentProcessor,
} from '../../public-api';
import { useFormStatus } from '../form-status';

export function createFreePaymentMethod() {
	return {
		id: 'free-purchase',
		label: <FreePurchaseLabel />,
		submitButton: <FreePurchaseSubmitButton />,
		inactiveContent: <FreePurchaseSummary />,
		getAriaLabel: () => __( 'Free' ),
	};
}

function FreePurchaseLabel() {
	return (
		<React.Fragment>
			<div>{ __( 'Free Purchase' ) }</div>
		</React.Fragment>
	);
}

function FreePurchaseSubmitButton( { disabled } ) {
	const [ items, total ] = useLineItems();
	const {
		setTransactionComplete,
		setTransactionError,
		setTransactionPending,
	} = useTransactionStatus();
	const { formStatus } = useFormStatus();
	const onEvent = useEvents();
	const submitTransaction = usePaymentProcessor( 'free-purchase' );

	const onClick = () => {
		setTransactionPending();
		onEvent( { type: 'FREE_TRANSACTION_BEGIN' } );
		submitTransaction( {
			items,
		} )
			.then( () => {
				setTransactionComplete();
			} )
			.catch( ( error ) => {
				setTransactionError( error.message );
			} );
	};

	return (
		<Button
			disabled={ disabled }
			onClick={ onClick }
			buttonState={ disabled ? 'disabled' : 'primary' }
			isBusy={ 'submitting' === formStatus }
			fullWidth
		>
			<ButtonContents formStatus={ formStatus } total={ total } />
		</Button>
	);
}

function ButtonContents( { formStatus, total } ) {
	if ( formStatus === 'submitting' ) {
		return __( 'Processing…' );
	}
	if ( formStatus === 'ready' ) {
		return sprintf(
			__( 'Complete Checkout' ),
			renderDisplayValueMarkdown( total.amount.displayValue )
		);
	}
	return __( 'Please wait…' );
}

function FreePurchaseSummary() {
	return <div>{ __( 'Free Purchase' ) }</div>;
}
