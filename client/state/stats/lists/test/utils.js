/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	getSerializedStatsQuery,
	normalizers
} from '../utils';

describe( 'utils', () => {
	describe( 'getSerializedStatsQuery()', () => {
		it( 'should return a JSON string of a query', () => {
			const serializedQuery = getSerializedStatsQuery( {
				startDate: '2016-06-01',
				endDate: '2016-07-01'
			} );

			expect( serializedQuery ).to.equal( '[["endDate","2016-07-01"],["startDate","2016-06-01"]]' );
		} );

		it( 'should return the same JSON string of a query regardless of query object order', () => {
			const serializedQuery = getSerializedStatsQuery( {
				startDate: '2016-06-01',
				endDate: '2016-07-01'
			} );

			const serializedQueryTwo = getSerializedStatsQuery( {
				endDate: '2016-07-01',
				startDate: '2016-06-01'
			} );

			expect( serializedQuery ).to.eql( serializedQueryTwo );
		} );
	} );

	describe( 'normalizers', () => {
		describe( 'stats()', () => {
			it( 'should return null if no data is passed', () => {
				const parsedData = normalizers.stats();

				expect( parsedData ).to.be.null;
			} );

			it( 'should return null if data object is missing stats attribute', () => {
				const parsedData = normalizers.stats( { foo: false } );

				expect( parsedData ).to.be.null;
			} );

			it( 'should return parsed camelCased stats object', () => {
				const parsedData = normalizers.stats( { stats: {
					posts: 2,
					views: 300,
					visitors: 400,
					views_best_day: '2010-09-29',
					views_best_day_total: 100
				} } );

				expect( parsedData ).to.eql( {
					posts: 2,
					views: 300,
					visitors: 400,
					viewsBestDay: '2010-09-29',
					viewsBestDayTotal: 100
				} );
			} );
		} );

		describe( 'statsInsights()', () => {
			it( 'should return an empty object if no data is passed', () => {
				const stats = normalizers.statsInsights();

				expect( stats ).to.eql( {} );
			} );

			it( 'should return null if data.highest_day_of_week is not numeric', () => {
				const stats = normalizers.statsInsights( { highest_day_of_week: false } );

				expect( stats ).to.eql( {} );
			} );

			it( 'should return properly formatted data if matching data exists', () => {
				const stats = normalizers.statsInsights( {
					highest_hour: 11,
					highest_day_percent: 10,
					highest_day_of_week: 6,
					highest_hour_percent: 5
				} );

				expect( stats ).to.eql( {
					day: 'Sunday',
					hour: '11:00 AM',
					hourPercent: 5,
					percent: 10
				} );
			} );
		} );
	} );
} );
