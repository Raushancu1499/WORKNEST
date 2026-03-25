package com.worknest.dto.profile;

import com.worknest.dto.common.UserSummaryResponse;

public record ContractorProfileResponse(
    Long id,
    UserSummaryResponse user,
    String companyName,
    String businessFocus
) {
}
