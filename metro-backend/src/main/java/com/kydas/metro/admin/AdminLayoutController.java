package com.kydas.metro.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.ADMIN_LAYOUT_ENDPOINT;

@RestController
@RequestMapping(ADMIN_LAYOUT_ENDPOINT)
public class AdminLayoutController {
    @Value("#{environment.VIDEO_LINK}")
    private String videoLink;

    @Value("#{environment.DOCS_LINK}")
    private String docsLink;

    @Value("#{environment.CONTACT_LINK}")
    private String contactLink;

    @GetMapping
    public AdminLayout solutionData() {
        return new AdminLayout()
            .setVideoLink(videoLink)
            .setDocsLink(docsLink)
            .setContactLink(contactLink);
    }
}
