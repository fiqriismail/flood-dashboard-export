/**
 * Type definitions for the Supabase Public Data API
 * Flood Assistance Request and Contribution Data
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: number;
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Urgency levels for assistance requests
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Status of assistance request
 */
export type RequestStatus = 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'cancelled';

/**
 * Types of assistance needed
 */
export type AssistanceType = 'Food' | 'Water' | 'Shelter' | 'Medical' | 'Evacuation' | 'Medicine' | 'Other';

/**
 * Flood Assistance Request
 */
export interface FloodAssistanceRequest {
    id: string;
    full_name: string;
    mobile_number: string;
    mobile_number_2: string;
    email?: string;
    address: string;
    latitude: number;
    longitude: number;
    num_women: number;
    num_children: number;
    num_men: number;
    urgency: UrgencyLevel;
    assistance_types: AssistanceType[];
    additional_notes: string;
    status: RequestStatus;
    image_urls: string[];
    created_at: string;
    updated_at: string;
    establishment_type: string;
    resolved_by_user_id: string | null;
    resolved_by_name: string | null;
    resolved_at: string | null;
    acknowledged_at?: string | null;
    acknowledged_by?: string | null;
    acknowledged_by_name?: string | null;
    distance_km?: number;
}

// ============================================================================
// CONTRIBUTION TYPES
// ============================================================================

/**
 * Types of contributions
 */
export type ContributionType = 'Goods' | 'Services' | 'Labor';

/**
 * Types of goods contributions
 */
export type GoodsType = 'Food' | 'Medicine' | 'Clothing' | 'Water' | 'Other';

/**
 * Types of services contributions
 */
export type ServicesType = 'Medical' | 'Transportation' | 'Shelter' | 'Communication' | 'Other';

/**
 * Types of labor contributions
 */
export type LaborType = 'Construction' | 'Cleanup' | 'Distribution' | 'Medical' | 'Other';

/**
 * Status of contribution
 */
export type ContributionStatus = 'available' | 'committed' | 'delivered' | 'unavailable';

/**
 * Flood Contribution
 */
export interface FloodContribution {
    id: string;
    full_name: string;
    mobile_number: string;
    mobile_number_2: string | null;
    email: string;
    address: string;
    latitude: number;
    longitude: number;
    contribution_types: ContributionType[];
    goods_types: GoodsType[] | null;
    services_types: ServicesType[] | null;
    labor_types: LaborType[] | null;
    coverage_radius_km: number;
    status: ContributionStatus;
    verified: boolean;
    verified_by_name: string | null;
    verified_by_user_id: string | null;
    verified_at: string | null;
    pickup_required: boolean;
    availability_notes: string | null;
    additional_notes: string | null;
    created_at: string;
    updated_at: string;
    distance_km?: number;
}

// ============================================================================
// API METADATA TYPES
// ============================================================================

/**
 * Location filter for radius-based search
 */
export interface LocationFilter {
    lat: number;
    lng: number;
    radius_km: number;
}

/**
 * Filters applied to the data query
 */
export interface FiltersApplied {
    type?: 'all' | 'requests' | 'contributions';
    status?: string | 'all';
    urgency?: UrgencyLevel | null;
    establishment?: string | null;
    assistance_type?: AssistanceType | null;
    contribution_type?: ContributionType | null;
    search?: string | null;
    location?: LocationFilter | null;
    sort?: 'newest' | 'oldest' | 'nearest';
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    limit: number;
    offset: number;
    returned_requests: number;
    returned_contributions: number;
}

/**
 * API response metadata
 */
export interface ApiMeta {
    total_requests: number;
    total_contributions: number;
    filters_applied: FiltersApplied;
    pagination: PaginationMeta;
}

/**
 * Complete API response with requests, contributions, and metadata
 */
export interface FloodDataResponse {
    requests: FloodAssistanceRequest[];
    contributions: FloodContribution[];
    meta: ApiMeta;
}
