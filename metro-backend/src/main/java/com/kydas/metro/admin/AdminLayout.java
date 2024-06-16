package com.kydas.metro.admin;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class AdminLayout {
    String videoLink;
    String docsLink;
    String contactLink;
}
