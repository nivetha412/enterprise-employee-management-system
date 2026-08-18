package com.enterprise.backend.controller;

import com.enterprise.backend.dto.DashboardReportDto;
import com.enterprise.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardReportDto getDashboardReport() {

        return reportService.getDashboardReport();

    }

}
