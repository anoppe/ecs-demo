package eu.luminis.ecsdemo

import com.amazonaws.xray.spring.aop.XRayEnabled
import org.springframework.boot.actuate.info.Info
import org.springframework.boot.actuate.info.InfoContributor
import org.springframework.stereotype.Component
import java.net.InetAddress

@Component
@XRayEnabled
class CustomInfoContributor : InfoContributor {

    override fun contribute(builder: Info.Builder?) {
        builder?.
        withDetail("hostname", InetAddress.getLocalHost().hostName)
    }
}
