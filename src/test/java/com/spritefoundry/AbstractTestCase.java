package com.spritefoundry;

import org.junit.After;
import org.junit.Before;

import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.googlecode.restitory.api.servlet.JsonServiceFilter;
import com.googlecode.restitory.gae.http.HttpClientRequestService;
import com.googlecode.restitory.gae.http.RequestAdapter;
import com.googlecode.restitory.gae.http.RequestService;

public class AbstractTestCase {

    protected GAETestHelper helper;

    protected RequestService service;

    protected RequestAdapter adapter;

    @Before
    public void setUp() throws Exception {
        helper = createGAETestHelper();
        helper.prepareLocalServiceTestHelper();
        helper.bootMycontainer();

        service = new HttpClientRequestService("http://localhost:8380");
        adapter = new RequestAdapter(service);

        JsonServiceFilter.open(false);
    }

    protected GAETestHelper createGAETestHelper() {
        GAETestHelper gae = new GAETestHelper();
        gae.prepareLocalTaskQueueMock();
        return gae;
    }

    @After
    public void tearDown() {

        JsonServiceFilter.close();

        if (helper != null) {
            helper.shutdownMycontainer();
        }
    }

    protected void clearCache() {
        MemcacheServiceFactory.getMemcacheService().clearAll();
    }

}
