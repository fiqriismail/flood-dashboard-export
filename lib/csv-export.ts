import { FloodAssistanceRequest, FloodContribution } from './api-types';

/**
 * Converts an array of objects to CSV string
 */
function convertToCSV<T extends Record<string, unknown>>(data: T[]): string {
    if (data.length === 0) {
        return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map((header) => {
            const val = row[header];
            const escaped = ('' + (val ?? '')).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

/**
 * Triggers a download of the CSV file
 */
function downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Formats current date as ddmmyyyyhhmmss
 */
function getTimestamp(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

/**
 * Exports requests to CSV
 */
export function exportRequestsToCSV(requests: FloodAssistanceRequest[]) {
    const flattenedData = requests.map(req => ({
        ID: req.id,
        Name: req.full_name,
        Phone: req.mobile_number,
        Address: req.address,
        Urgency: req.urgency,
        Status: req.status,
        'Assistance Needed': req.assistance_types.join('; '),
        'People (Men/Women/Children)': `${req.num_men}/${req.num_women}/${req.num_children}`,
        'Additional Notes': req.additional_notes || '',
        'Created At': new Date(req.created_at).toLocaleString(),
    }));

    const csv = convertToCSV(flattenedData);
    downloadCSV(csv, `flood_requests_${getTimestamp()}.csv`);
}

/**
 * Exports contributions to CSV
 */
export function exportContributionsToCSV(contributions: FloodContribution[]) {
    const flattenedData = contributions.map(con => ({
        ID: con.id,
        Name: con.full_name,
        Phone: con.mobile_number,
        Address: con.address,
        Status: con.status,
        'Contribution Types': con.contribution_types.join('; '),
        'Coverage (km)': con.coverage_radius_km,
        Verified: con.verified ? 'Yes' : 'No',
        'Additional Notes': con.additional_notes || '',
        'Created At': new Date(con.created_at).toLocaleString(),
    }));

    const csv = convertToCSV(flattenedData);
    downloadCSV(csv, `flood_contributions_${getTimestamp()}.csv`);
}

/**
 * Converts an array of objects to TSV string (Tab Separated Values)
 * This format works best for pasting into Google Sheets/Excel
 */
function convertToTSV<T extends Record<string, unknown>>(data: T[]): string {
    if (data.length === 0) {
        return '';
    }

    const headers = Object.keys(data[0]);
    const tsvRows = [headers.join('\t')];

    for (const row of data) {
        const values = headers.map((header) => {
            const val = row[header];
            // Remove tabs and newlines from content to prevent breaking the format
            const cleanVal = ('' + (val ?? '')).replace(/[\t\n\r]/g, ' ');
            return cleanVal;
        });
        tsvRows.push(values.join('\t'));
    }

    return tsvRows.join('\n');
}

/**
 * Copies text to clipboard
 */
async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}

/**
 * Copies requests to clipboard for Google Sheets
 */
export async function copyRequestsToClipboard(requests: FloodAssistanceRequest[]): Promise<boolean> {
    const flattenedData = requests.map(req => ({
        ID: req.id,
        Name: req.full_name,
        Phone: req.mobile_number,
        Address: req.address,
        Urgency: req.urgency,
        Status: req.status,
        'Assistance Needed': req.assistance_types.join('; '),
        'People (Men/Women/Children)': `${req.num_men}/${req.num_women}/${req.num_children}`,
        'Additional Notes': req.additional_notes || '',
        'Created At': new Date(req.created_at).toLocaleString(),
    }));

    const tsv = convertToTSV(flattenedData);
    return await copyToClipboard(tsv);
}

/**
 * Copies contributions to clipboard for Google Sheets
 */
export async function copyContributionsToClipboard(contributions: FloodContribution[]): Promise<boolean> {
    const flattenedData = contributions.map(con => ({
        ID: con.id,
        Name: con.full_name,
        Phone: con.mobile_number,
        Address: con.address,
        Status: con.status,
        'Contribution Types': con.contribution_types.join('; '),
        'Coverage (km)': con.coverage_radius_km,
        Verified: con.verified ? 'Yes' : 'No',
        'Additional Notes': con.additional_notes || '',
        'Created At': new Date(con.created_at).toLocaleString(),
    }));

    const tsv = convertToTSV(flattenedData);
    return await copyToClipboard(tsv);
}
