package eu.luminis.ecsdemo

import com.amazonaws.xray.entities.Subsegment
import com.amazonaws.xray.spring.aop.AbstractXRayInterceptor
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.springframework.stereotype.Component


@Aspect
@Component
class XRayInspector : AbstractXRayInterceptor() {

    @Throws(Exception::class)
    override fun generateMetadata(proceedingJoinPoint: ProceedingJoinPoint, subsegment: Subsegment): Map<String, Map<String, Any>> {
        return super.generateMetadata(proceedingJoinPoint, subsegment)
    }

    @Pointcut("@within(com.amazonaws.xray.spring.aop.XRayEnabled)")
    override fun xrayEnabledClasses() {
    }

}
