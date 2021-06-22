package eu.luminis.ecsdemo

import com.amazonaws.xray.spring.aop.XRayEnabled
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.actuate.info.Info
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@XRayEnabled
@RequestMapping("/api")
class MyInfoController {

    @Autowired
    private lateinit var infoContributor: CustomInfoContributor

    @RequestMapping("index")
    fun index(): Info? {
        val builder = Info.Builder()
        infoContributor.contribute(builder)
        return builder.build()
    }
}
