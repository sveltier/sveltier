// Sample data for the starter. Replace it with your own: a load function, an API, a database.

export const STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue'] as const;

export type Status = (typeof STATUSES)[number];

export interface Invoice {
	id: string;
	client: string;
	/** ISO date, 'YYYY-MM-DD', as every Sveltier date prop takes it. */
	due: string;
	amount: number;
	status: Status;
}

export const invoices: Invoice[] = [
	{ id: 'INV-1042', client: 'Northwind Traders', due: '2026-12-04', amount: 4280, status: 'Sent' },
	{ id: 'INV-1041', client: 'Blue Harbor Studio', due: '2026-11-28', amount: 1150, status: 'Paid' },
	{ id: 'INV-1040', client: 'Atlas Freight', due: '2026-11-15', amount: 9600, status: 'Overdue' },
	{ id: 'INV-1039', client: 'Lumen Health', due: '2026-12-12', amount: 2375.5, status: 'Draft' },
	{ id: 'INV-1038', client: 'Copperleaf Farms', due: '2026-11-02', amount: 640, status: 'Paid' }
];
